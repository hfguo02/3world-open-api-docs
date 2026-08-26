import React from 'react';
import ParamsItemOriginal from '@theme-original/ParamsItem';

type Props = React.ComponentProps<typeof ParamsItemOriginal>;

export default function ParamsItem(props: Props) {
  const required = Boolean(props.param.required);
  return (
    <div className="api-field" data-required={required}>
      <span className="api-field__requirement">
        {required ? '必填' : '可选'}
      </span>
      <ParamsItemOriginal {...props} />
    </div>
  );
}
