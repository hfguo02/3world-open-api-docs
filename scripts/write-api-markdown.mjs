import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const RELEASES = [
  {
    spec: 'openapi/whitelabel/releases/whitelabel-api-v1.1.0.json',
    routePrefix: '/api',
  },
  {
    spec: 'openapi/whitelabel/releases/whitelabel-api-v1.0.0.json',
    routePrefix: '/v1/api',
  },
];

function operationSlug(operationId) {
  return operationId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

function localReference(reference, spec) {
  if (!reference?.startsWith('#/')) return undefined;
  return reference
    .slice(2)
    .split('/')
    .reduce((value, segment) => value?.[segment], spec);
}

function resolvedSchema(schema, spec, references = new Set()) {
  if (!schema?.$ref || references.has(schema.$ref)) return schema;
  const resolved = localReference(schema.$ref, spec);
  if (!resolved) throw new Error(`无法解析 OpenAPI 引用：${schema.$ref}`);
  return resolvedSchema(resolved, spec, new Set(references).add(schema.$ref));
}

function schemaType(schema, spec) {
  const resolved = resolvedSchema(schema, spec) ?? {};
  if (resolved.type === 'array') return `${schemaType(resolved.items, spec)}[]`;
  const baseType = resolved.type ?? (resolved.properties ? 'object' : 'unknown');
  return resolved.format ? `${baseType}<${resolved.format}>` : baseType;
}

function schemaDescription(schema, spec) {
  const resolved = resolvedSchema(schema, spec) ?? {};
  const values = resolved.enum?.length
    ? `可选值：${resolved.enum.map(String).join('、')}`
    : '';
  return [schema?.description ?? resolved.description, values].filter(Boolean).join('；');
}

function collectSchemaRows(schema, spec, prefix = '', references = new Set()) {
  if (!schema) return [];
  if (schema.$ref) {
    if (references.has(schema.$ref)) return [];
    const resolved = localReference(schema.$ref, spec);
    if (!resolved) throw new Error(`无法解析 OpenAPI 引用：${schema.$ref}`);
    return collectSchemaRows(
      resolved,
      spec,
      prefix,
      new Set(references).add(schema.$ref),
    );
  }

  const composedRows = ['allOf', 'oneOf', 'anyOf'].flatMap((keyword) =>
    (schema[keyword] ?? []).flatMap((item) =>
      collectSchemaRows(item, spec, prefix, references),
    ),
  );
  const required = new Set(schema.required ?? []);
  const propertyRows = Object.entries(schema.properties ?? {}).flatMap(
    ([name, property]) => {
      const field = prefix ? `${prefix}.${name}` : name;
      const row = {
        field,
        type: schemaType(property, spec),
        required: required.has(name),
        description: schemaDescription(property, spec),
      };
      const nested = resolvedSchema(property, spec);
      const childSchema = nested?.type === 'array' ? nested.items : nested;
      return [row, ...collectSchemaRows(childSchema, spec, field, references)];
    },
  );

  const rows = [...composedRows, ...propertyRows];
  return [...new Map(rows.map((row) => [row.field, row])).values()];
}

function escapeCell(value) {
  return String(value ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', '<br>');
}

function schemaTable(rows) {
  if (rows.length === 0) return '';
  return [
    '| 字段 | 类型 | 必填 | 说明 |',
    '| --- | --- | --- | --- |',
    ...rows.map(({field, type, required, description}) =>
      `| \`${escapeCell(field)}\` | \`${escapeCell(type)}\` | ${required ? '是' : '否'} | ${escapeCell(description)} |`,
    ),
  ].join('\n');
}

function parameterTable(parameters, spec) {
  const locationLabels = {
    path: '路径',
    query: '查询',
    header: '请求头',
    cookie: 'Cookie',
  };
  const rows = parameters.map((parameter) => {
    const resolved = parameter.$ref ? localReference(parameter.$ref, spec) : parameter;
    if (!resolved) throw new Error(`无法解析 OpenAPI 参数：${parameter.$ref}`);
    return `| \`${escapeCell(resolved.name)}\` | ${locationLabels[resolved.in] ?? resolved.in} | \`${escapeCell(schemaType(resolved.schema, spec))}\` | ${resolved.required ? '是' : '否'} | ${escapeCell(resolved.description)} |`;
  });
  if (rows.length === 0) return '';
  return [
    '| 参数 | 位置 | 类型 | 必填 | 说明 |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n');
}

function explicitExample(media) {
  if (!media) return undefined;
  if (Object.hasOwn(media, 'example')) return media.example;
  const named = Object.values(media.examples ?? {}).find(
    (example) => example && Object.hasOwn(example, 'value'),
  );
  if (named) return named.value;
  return Object.hasOwn(media.schema ?? {}, 'example')
    ? media.schema.example
    : undefined;
}

function jsonMedia(content) {
  return Object.entries(content ?? {}).find(([mimeType]) =>
    mimeType.toLowerCase().endsWith('json'),
  )?.[1];
}

function jsonBlock(value) {
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

function renderOperation(operation, apiPath, spec, pageUrl) {
  const sections = [
    `# ${operation.summary}`,
    `URL: ${pageUrl}`,
    `\`${operation.method.toUpperCase()} ${apiPath}\``,
    operation.description,
  ];

  const parameters = parameterTable(operation.parameters ?? [], spec);
  const requestMedia = jsonMedia(operation.requestBody?.content);
  const requestSchema = schemaTable(collectSchemaRows(requestMedia?.schema, spec));
  if (parameters || requestSchema) {
    sections.push('## 请求');
    if (parameters) sections.push('### 请求参数', parameters);
    if (requestSchema) sections.push('### 请求体', requestSchema);
  }

  const requestExample = operation.method !== 'get'
    ? explicitExample(requestMedia)
    : undefined;
  if (requestExample !== undefined) {
    sections.push('### 请求示例', jsonBlock(requestExample));
  }

  const responseSections = Object.entries(operation.responses ?? {}).flatMap(
    ([status, response]) => {
      const media = jsonMedia(response.content);
      const table = schemaTable(collectSchemaRows(media?.schema, spec));
      const example = explicitExample(media);
      return [
        `### ${status} ${response.description ?? ''}`.trim(),
        table,
        ...(example === undefined ? [] : ['#### 响应示例', jsonBlock(example)]),
      ].filter(Boolean);
    },
  );
  if (responseSections.length > 0) sections.push('## 响应', ...responseSections);

  return `${sections.filter(Boolean).join('\n\n')}\n`;
}

async function writeReleaseMarkdown({spec: specPath, routePrefix}, context) {
  const absoluteSpecPath = path.join(context.siteDir, specPath);
  const spec = JSON.parse(await readFile(absoluteSpecPath, 'utf8'));

  for (const [apiPath, pathItem] of Object.entries(spec.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation?.operationId) continue;

      const slug = operationSlug(operation.operationId);
      const route = `${routePrefix}/${slug}`;
      const outputPath = path.join(context.outDir, `${route.slice(1)}.md`);
      await mkdir(path.dirname(outputPath), {recursive: true});
      await writeFile(
        outputPath,
        renderOperation(
          {...operation, method},
          apiPath,
          spec,
          route,
        ),
        'utf8',
      );
    }
  }
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, '..');
const outDir = path.resolve(siteDir, process.argv[2] ?? 'build');

await Promise.all(
  RELEASES.map((release) => writeReleaseMarkdown(release, {siteDir, outDir})),
);
await rm(path.join(outDir, 'v1', 'v1'), {recursive: true, force: true});
