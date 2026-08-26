import React from 'react';
import Details from '@theme/Details';

import ParamsItem from '@site/src/theme/ParamsItem';

type Parameter = React.ComponentProps<typeof ParamsItem>['param'];

type EnumSchema = {
  'x-enumDescriptions'?: Record<string, string>;
  items?: {'x-enumDescriptions'?: Record<string, string>};
};

const PARAMETER_GROUPS = [
  {type: 'path', label: '路径参数'},
  {type: 'query', label: '查询参数'},
  {type: 'header', label: '请求头'},
  {type: 'cookie', label: 'Cookie 参数'},
] as const;

function withEnumDescriptions(parameter: Parameter): Parameter {
  const schema = parameter.schema as EnumSchema | undefined;
  const descriptions = schema?.['x-enumDescriptions']
    ?? schema?.items?.['x-enumDescriptions']
    ?? {};
  return {
    ...parameter,
    enumDescriptions: Object.entries(descriptions),
  };
}

export default function ParamsDetails({
  parameters = [],
}: {
  parameters?: Parameter[];
}) {
  return (
    <>
      {PARAMETER_GROUPS.map(({type, label}) => {
        const group = parameters.filter((parameter) => parameter.in === type);
        if (group.length === 0) return null;

        return (
          <Details
            key={type}
            className="openapi-markdown__details"
            style={{marginBottom: '1rem'}}
            data-collapsed={false}
            open
            summary={
              <summary>
                <h3 className="openapi-markdown__details-summary-header-params">
                  {label}
                </h3>
              </summary>
            }>
            <ul>
              {group.map((parameter) => (
                <ParamsItem
                  key={`${parameter.in}-${parameter.name}`}
                  className="paramsItem"
                  param={withEnumDescriptions(parameter)}
                />
              ))}
            </ul>
          </Details>
        );
      })}
    </>
  );
}
