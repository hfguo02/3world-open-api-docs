import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function LegacyHome(): React.JSX.Element {
  return <Redirect to={useBaseUrl('/v1/introduction')} />;
}
