import React from 'react';
import Link from '@docusaurus/Link';

import currentSpec from '@site/openapi/whitelabel/releases/whitelabel-api-v1.1.0.json';
import legacySpec from '@site/openapi/whitelabel/releases/whitelabel-api-v1.0.0.json';
import {
  apiBasePath,
  operationSlug,
  type ApiRelease,
} from '@site/src/lib/apiPaths';

type Operation = {
  operationId: string;
  summary: string;
  tags?: string[];
};

type Spec = typeof currentSpec | typeof legacySpec;

const SPECS: Record<ApiRelease, Spec> = {
  '1.1.0': currentSpec,
  '1.0.0': legacySpec,
};

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

function operationsForTag(spec: Spec, tagName: string) {
  return Object.values(spec.paths).flatMap((pathItem) =>
    HTTP_METHODS.flatMap((method) => {
      const operation = pathItem[method] as Operation | undefined;
      return operation?.tags?.includes(tagName) ? [operation] : [];
    }),
  );
}

export default function ApiOverview({version}: {version: ApiRelease}) {
  const spec = SPECS[version];
  const modules = spec.tags.map((tag) => ({
    ...tag,
    operations: operationsForTag(spec, tag.name),
  }));
  const endpointCount = modules.reduce(
    (total, module) => total + module.operations.length,
    0,
  );

  return (
    <div className="api-overview">
      <header className="api-overview__header">
        <p className="api-overview__eyebrow">
          3World Open API · V{version === '1.1.0' ? '2' : '1'}
        </p>
        <h1>API 文档</h1>
        <p>
          按业务模块查找接口。每个接口页包含请求参数、字段约束、响应结构和明确维护的 JSON 示例。
        </p>
        <span>{endpointCount} 个接口</span>
      </header>

      <div className="api-module-grid">
        {modules.map(({name, description, operations}) => {
          const firstOperation = operations[0];
          return (
            <Link
              className="api-module-card"
              key={name}
              to={`${apiBasePath(version)}/${operationSlug(firstOperation.operationId)}`}>
              <div>
                <h2>{name}</h2>
                <p>{description}</p>
              </div>
              <footer>
                <span>{operations.length} 个接口</span>
                <span aria-hidden="true">→</span>
              </footer>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
