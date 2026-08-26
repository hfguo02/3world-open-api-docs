import React, {useEffect} from 'react';

export default function LegacyHome(): React.JSX.Element | null {
  useEffect(() => {
    const canonicalUrl = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const entryUrl = canonicalUrl?.replace(/\/?$/, '/') ?? window.location.href;
    window.location.replace(new URL('introduction', entryUrl).toString());
  }, []);

  return null;
}
