import React from 'react';
import {Redirect} from '@docusaurus/router';

export default function LegacyHome(): React.JSX.Element {
  return <Redirect to="/v1/introduction" />;
}
