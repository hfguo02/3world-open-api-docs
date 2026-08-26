import React, {useEffect} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function LegacyHome(): React.JSX.Element | null {
  const introductionUrl = useBaseUrl('/v1/introduction', {
    forcePrependBaseUrl: true,
  });

  useEffect(() => {
    window.location.replace(new URL(introductionUrl, window.location.origin).toString());
  }, [introductionUrl]);

  return null;
}
