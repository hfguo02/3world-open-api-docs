import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, '..');
const sourcePath = path.join(
  siteDir,
  'openapi/whitelabel/whitelabel-api-openapi.json',
);
const outputDir = path.join(siteDir, 'openapi/whitelabel/releases');
const currentSidebarPath = path.join(siteDir, 'sidebars.ts');

const CURRENT_REPLACED_PATHS = new Set([
  '/openapi/account/v1/partner/balance',
  '/openapi/account/v1/credit',
  '/openapi/account/v1/credit/query',
]);

const RELEASES = {
  '1.1.0': {
    includePath: (apiPath) => !CURRENT_REPLACED_PATHS.has(apiPath),
    description: '供白标商户对接 Card 业务的 API。',
  },
};

const MODULES = [
  ['application', '卡片申请', '卡片申请、材料上传与申请查询'],
  ['card', '卡片管理', '卡片查询与状态管理'],
  ['account', '账户与授信', '余额查询与卡片授信'],
  ['transaction', '交易查询', '卡片交易查询'],
];

const FIELD_DESCRIPTIONS = {
  addressLine1: '账单地址第一行',
  addressLine2: '账单地址第二行',
  amount: '金额',
  applicationId: '申请单唯一标识',
  applyTime: '申请时间',
  availableBalance: '可用余额',
  basicAmount: '基础币种金额',
  basicCurrency: '基础币种',
  billingAddress: '账单地址',
  cardHolderName: '持卡人姓名',
  cardId: '卡片唯一标识',
  cardSchema: '卡组织',
  cardType: '卡片类型',
  cardholderName: '持卡人姓名',
  city: '城市',
  closeTime: '卡片关闭时间',
  code: '响应代码',
  completedAt: '处理完成时间',
  consumerIdLifecycle: '交易生命周期标识',
  country: '国家或地区代码',
  countryCode: '国际电话区号',
  createdAt: '创建时间',
  creditId: '授信请求唯一标识',
  currency: '币种',
  customerNo: '客户编号',
  cvv: '卡片安全码',
  data: '响应数据',
  dateOfBirth: '出生日期',
  email: '电子邮箱',
  expirationDate: '证件到期日期',
  expireDate: '卡片有效期，格式为 MM/YY',
  expireMonth: '卡片到期月份',
  expireYear: '卡片到期年份',
  failReason: '失败原因',
  file: '申请材料文件',
  fileType: '申请材料类型',
  firstName: '名字',
  frozenAmount: '冻结金额',
  fullPan: '完整卡号',
  iframeUrl: '部分卡产品仅支持通过安全 Iframe 展示敏感信息。请在有效期内使用返回地址，不要记录、存储或复用',
  idNo: '证件号码',
  idType: '证件类型',
  issuanceDate: '证件签发日期',
  issueTime: '卡片签发时间',
  kyc: '身份核验信息',
  lastName: '姓氏',
  lastUpdatedAt: '最后更新时间',
  mccCode: '商户类别代码',
  merchantCity: '商户所在城市',
  merchantCountry: '商户所在国家或地区',
  merchantName: '商户名称',
  msg: '响应说明',
  orderNo: '交易订单号',
  pageNo: '当前页码',
  pageSize: '每页记录数',
  pan: '完整卡号',
  pan4: '卡号后四位',
  pan6: '卡号前六位',
  partnerId: '白标商户唯一标识',
  phone: '联系电话',
  phoneNumber: '电话号码',
  pin: '六位交易 PIN',
  postalCode: '邮政编码',
  productCode: '卡产品代码',
  productName: '卡产品名称',
  reason: '操作原因',
  rejectReason: '申请拒绝原因',
  remark: '备注',
  settleTime: '交易结算时间',
  state: '州或省',
  status: '当前状态',
  sensitiveDisplayMode: '敏感信息展示方式',
  success: '请求是否成功',
  totalAmount: '总余额',
  totalCount: '记录总数',
  totalPage: '总页数',
  txnAmount: '交易币种金额',
  txnBizType: '交易业务类型',
  txnCurrency: '交易币种',
  txnTime: '交易发生时间',
  txnType: '交易类型',
  uid: '用户唯一标识',
  version: '文件版本号',
};

const PARAMETER_DESCRIPTIONS = {
  applicationId: FIELD_DESCRIPTIONS.applicationId,
  cardId: FIELD_DESCRIPTIONS.cardId,
  cardType: FIELD_DESCRIPTIONS.cardType,
  creditId: FIELD_DESCRIPTIONS.creditId,
  endTime: '查询结束时间，Unix 时间戳（毫秒）',
  orderNo: FIELD_DESCRIPTIONS.orderNo,
  pageNum: FIELD_DESCRIPTIONS.pageNo,
  pageSize: FIELD_DESCRIPTIONS.pageSize,
  startTime: '查询开始时间，Unix 时间戳（毫秒）',
  uid: FIELD_DESCRIPTIONS.uid,
};

const SUPPORTED_METHODS = new Set(['get', 'post']);

function clone(value) {
  return structuredClone(value);
}

function moduleForPath(apiPath) {
  const resource = apiPath.split('/').filter(Boolean)[1];
  const module = MODULES.find(([segment]) => segment === resource);
  if (!module) {
    throw new Error(`未配置业务模块：${apiPath}`);
  }
  return module;
}

function stripInternalTerms(text) {
  return text.replaceAll('（兼容）', '').replaceAll('兼容接口', '接口');
}

function decorateSchema(schema, location) {
  if (!schema || typeof schema !== 'object') return;

  for (const [name, property] of Object.entries(schema.properties ?? {})) {
    const description = FIELD_DESCRIPTIONS[name];
    if (!description) {
      throw new Error(`字段缺少说明：${location}.${name}`);
    }
    property.description ??= description;
    decorateSchema(property, `${location}.${name}`);
  }

  decorateSchema(schema.items, `${location}[]`);
  for (const [index, item] of (schema.allOf ?? []).entries()) {
    decorateSchema(item, `${location}.allOf[${index}]`);
  }
  for (const [index, item] of (schema.oneOf ?? []).entries()) {
    decorateSchema(item, `${location}.oneOf[${index}]`);
  }
  for (const [index, item] of (schema.anyOf ?? []).entries()) {
    decorateSchema(item, `${location}.anyOf[${index}]`);
  }
}

function decorateParameters(spec) {
  for (const [name, parameter] of Object.entries(spec.components.parameters)) {
    parameter.description ??= PARAMETER_DESCRIPTIONS[parameter.name];
    if (!parameter.description) {
      throw new Error(`公共参数缺少说明：${name}`);
    }
  }
}

function hasExplicitExample(media) {
  return Boolean(
    media
      && (Object.hasOwn(media, 'example')
        || Object.values(media.examples ?? {}).some((example) =>
          example && Object.hasOwn(example, 'value'))),
  );
}

function validateOperationExamples(operation, method) {
  const id = operation.operationId;
  if (method === 'get' && operation.requestBody) {
    throw new Error(`GET 接口不应包含请求体：${id}`);
  }
  if (method === 'post') {
    const requestMedia = Object.values(operation.requestBody?.content ?? {});
    if (requestMedia.length === 0 || !requestMedia.some(hasExplicitExample)) {
      throw new Error(`POST 接口缺少显式请求示例：${id}`);
    }
  }

  const success = operation.responses?.['200']?.content?.['application/json'];
  if (!success?.schema) {
    throw new Error(`接口缺少 200 application/json Schema：${id}`);
  }
  if (!hasExplicitExample(success)) {
    throw new Error(`接口缺少显式 200 响应示例：${id}`);
  }
}

function stripRedundantOperationDescription(operation) {
  if (!operation.description) return;
  const normalize = (value) => value.trim().replace(/[。.!！]+$/u, '').trim();
  if (normalize(operation.description) === normalize(operation.summary)) {
    delete operation.description;
  }
}

function decorateOperation(operation, apiPath, method) {
  const [, moduleName] = moduleForPath(apiPath);
  operation.tags = [moduleName];
  operation.summary = stripInternalTerms(operation.summary);
  stripRedundantOperationDescription(operation);
  operation['x-request-encrypted'] = false;
  operation['x-request-signed'] = true;
  for (const parameter of operation.parameters ?? []) {
    if (parameter.$ref) continue;
    parameter.description ??= PARAMETER_DESCRIPTIONS[parameter.name];
    if (!parameter.description) {
      throw new Error(`接口参数缺少说明：${operation.operationId}.${parameter.name}`);
    }
    decorateSchema(parameter.schema, `${operation.operationId}.${parameter.name}`);
  }

  for (const [mimeType, media] of Object.entries(
    operation.requestBody?.content ?? {},
  )) {
    decorateSchema(media.schema, `${operation.operationId}.request.${mimeType}`);
  }

  for (const [status, response] of Object.entries(operation.responses ?? {})) {
    for (const [mimeType, media] of Object.entries(response.content ?? {})) {
      decorateSchema(media.schema, `${operation.operationId}.response.${status}.${mimeType}`);
    }
  }

  validateOperationExamples(operation, method);
}

function buildRelease(source, version, release) {
  const spec = clone(source);
  spec.info.version = version;
  spec.info.description = release.description;
  spec['x-api-release'] = version;
  spec.paths = Object.fromEntries(
    Object.entries(spec.paths).filter(([apiPath]) => release.includePath(apiPath)),
  );
  spec.tags = MODULES.filter(([segment]) =>
    Object.keys(spec.paths).some((apiPath) => moduleForPath(apiPath)[0] === segment),
  ).map(([, name, description]) => ({name, description}));

  decorateParameters(spec);
  for (const [apiPath, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (operation && typeof operation === 'object' && operation.operationId) {
        if (!SUPPORTED_METHODS.has(method)) {
          throw new Error(`发现未确认的 HTTP 方法 ${method.toUpperCase()}：${apiPath}`);
        }
        decorateOperation(operation, apiPath, method);
      }
    }
  }
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    decorateSchema(schema, `components.schemas.${name}`);
  }

  if (JSON.stringify(spec).includes('兼容')) {
    throw new Error(`${version} 仍包含内部术语“兼容”`);
  }
  return spec;
}

function operationSlug(operationId) {
  return operationId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

function buildApiCategories(spec) {
  const categories = spec.tags.map(({name}) => {
    const items = Object.entries(spec.paths).flatMap(([, pathItem]) =>
      Object.entries(pathItem).flatMap(([method, operation]) =>
        operation?.tags?.includes(name)
          ? [{
              type: 'doc',
              id: `api/${operationSlug(operation.operationId)}`,
              className: `${method} api-method`,
            }]
          : [],
      ),
    );
    return {type: 'category', label: name, items};
  });
  return categories;
}

function buildSidebar(spec) {
  return {
    docsSidebar: [
      {
        type: 'category',
        label: '开发者指南',
        link: {type: 'doc', id: 'introduction/index'},
        items: [
          'introduction/authentication-signature',
          'introduction/common-responses',
        ],
      },
      {
        type: 'category',
        label: 'Card',
        items: [
          'introduction/quickstart',
          {
            type: 'category',
            label: 'API 文档',
            link: {type: 'doc', id: 'api/api-overview'},
            items: buildApiCategories(spec),
          },
          {
            type: 'category',
            label: 'Webhook 事件',
            link: {type: 'doc', id: 'webhooks/index'},
            items: [
              'webhooks/application-events',
              'webhooks/card-events',
              'webhooks/transaction-events',
              'webhooks/credit-events',
            ],
          },
          'reference/error-codes',
        ],
      },
      {
        type: 'doc',
        id: 'funds/index',
        label: 'Funds',
      },
    ],
  };
}

function sidebarModule(sidebar) {
  return `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = ${JSON.stringify(sidebar, null, 2)};

export default sidebars;
`;
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
await mkdir(outputDir, {recursive: true});

const generatedReleases = new Map();
for (const [version, release] of Object.entries(RELEASES)) {
  const spec = buildRelease(source, version, release);
  const outputPath = path.join(outputDir, `whitelabel-api-v${version}.json`);
  await writeFile(outputPath, `${JSON.stringify(spec, null, 2)}\n`, 'utf8');
  generatedReleases.set(version, spec);
  console.log(`Generated ${path.relative(siteDir, outputPath)} (${Object.keys(spec.paths).length} APIs)`);
}

const currentSidebar = buildSidebar(generatedReleases.get('1.1.0'));
await writeFile(currentSidebarPath, sidebarModule(currentSidebar), 'utf8');
