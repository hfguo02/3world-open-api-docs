import React from 'react';
import Link from '@docusaurus/Link';

import currentSpec from '@site/openapi/whitelabel/releases/whitelabel-api-v1.1.0.json';
import {operationSlug} from '@site/src/lib/apiPaths';

type Operation = {
  operationId: string;
  summary: string;
  tags?: string[];
};

type Spec = typeof currentSpec;

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

function operationsForTag(spec: Spec, tagName: string) {
  return Object.values(spec.paths).flatMap((pathItem) =>
    HTTP_METHODS.flatMap((method) => {
      const operation = (pathItem as Record<string, Operation | undefined>)[method];
      return operation?.tags?.includes(tagName) ? [operation] : [];
    }),
  );
}

export default function ApiOverview() {
  const spec = currentSpec;
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
          3World Open API
        </p>
        <h1>API 文档</h1>
        <p>
          按业务模块查阅接口定义、请求参数、响应结构和 JSON 示例。
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
              to={`/api/${operationSlug(firstOperation.operationId)}`}>
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
