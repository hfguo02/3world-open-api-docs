import React, {type ReactNode} from 'react';
import DocRootLayoutOriginal from '@theme-original/DocRoot/Layout';
import type {Props} from '@theme/DocRoot/Layout';

import VersionBar from '@site/src/components/VersionBar';

export default function DocRootLayout(props: Props): ReactNode {
  return (
    <>
      <VersionBar />
      <div className="docs-centered-shell">
        <DocRootLayoutOriginal {...props} />
      </div>
    </>
  );
}
