import React from 'react';
import type {ApiItem} from 'docusaurus-plugin-openapi-docs/src/types';
import type {
  ExampleObject,
  MediaTypeObject,
} from 'docusaurus-plugin-openapi-docs/src/openapi/types';
import CodeBlock from '@theme/CodeBlock';

type ExplicitExample = {
  label: string;
  language: 'json' | 'text';
  value: unknown;
};

function explicitExample(media: MediaTypeObject | undefined): unknown | undefined {
  if (!media) return undefined;
  if (Object.hasOwn(media, 'example')) return media.example;

  const namedExample = Object.values(media.examples ?? {}).find(
    (example): example is ExampleObject =>
      Boolean(example) && Object.hasOwn(example, 'value'),
  );
  if (namedExample) return namedExample.value;
  return Object.hasOwn(media.schema ?? {}, 'example')
    ? media.schema?.example
    : undefined;
}

function multipartExample(media: MediaTypeObject, value: unknown): string {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('multipart/form-data 示例必须是字段对象');
  }

  const schema = media.schema;
  const binaryFields = schema && 'properties' in schema
    ? Object.entries(schema.properties ?? {})
        .filter(([, property]) =>
          property && 'format' in property && property.format === 'binary')
        .map(([name]) => name)
    : [];
  const fields = Object.entries(value).map(([name, fieldValue]) =>
    `${name}: ${String(fieldValue)}`,
  );
  const binaryNote = binaryFields.length > 0
    ? `${binaryFields.join('、')} 字段上传文件二进制，不传文件路径或 Base64 字符串。`
    : '文件字段上传二进制，不传文件路径或 Base64 字符串。';

  return [
    'Content-Type: multipart/form-data',
    '',
    ...fields,
    '',
    `提交说明：${binaryNote}`,
  ].join('\n');
}

function requestExample(item: ApiItem): ExplicitExample | undefined {
  if (item.method.toLowerCase() === 'get') return undefined;
  for (const [mimeType, media] of Object.entries(item.requestBody?.content ?? {})) {
    const value = explicitExample(media);
    if (value === undefined) continue;
    if (mimeType.toLowerCase() === 'multipart/form-data') {
      return {
        label: `请求示例 · ${mimeType}`,
        language: 'text',
        value: multipartExample(media, value),
      };
    }
    if (mimeType.toLowerCase().endsWith('json')) {
      return {label: `请求示例 · ${mimeType}`, language: 'json', value};
    }
  }
  return undefined;
}

function responseExample(item: ApiItem): ExplicitExample | undefined {
  const successResponses = Object.entries(item.responses)
    .filter(([status]) => /^2\d\d$/.test(status))
    .sort(([left], [right]) => left.localeCompare(right));

  for (const [status, response] of successResponses) {
    for (const [mimeType, media] of Object.entries(response.content ?? {})) {
      if (!mimeType.toLowerCase().endsWith('json')) continue;
      const value = explicitExample(media);
      if (value !== undefined) {
        return {
          label: `响应示例 · ${status} · ${mimeType}`,
          language: 'json',
          value,
        };
      }
    }
  }
  return undefined;
}

function ExampleBlock({example}: {example: ExplicitExample}) {
  return (
    <section className="api-example-rail__section">
      <h2>{example.label}</h2>
      <CodeBlock language={example.language}>
        {example.language === 'json'
          ? JSON.stringify(example.value, null, 2)
          : String(example.value)}
      </CodeBlock>
    </section>
  );
}

export default function ApiExplorer({item}: {item: ApiItem; infoPath: string}) {
  const examples = [requestExample(item), responseExample(item)].filter(
    (example): example is ExplicitExample => example !== undefined,
  );
  if (examples.length === 0) return null;

  return (
    <aside className="api-example-rail" aria-label="请求与响应示例">
      {examples.map((example) => (
        <ExampleBlock example={example} key={example.label} />
      ))}
    </aside>
  );
}
