import React from 'react';
import SchemaItemOriginal from '@theme-original/SchemaItem';

type Props = React.ComponentProps<typeof SchemaItemOriginal>;

export default function SchemaItem(props: Props) {
  const required = Array.isArray(props.required)
    ? props.required.includes(props.name ?? '')
    : Boolean(props.required);
  return (
    <div className="api-field" data-required={required}>
      <span className="api-field__requirement">
        {required ? '必填' : '可选'}
      </span>
      <SchemaItemOriginal {...props} />
    </div>
  );
}
