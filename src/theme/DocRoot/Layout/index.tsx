import React, {type ReactNode} from 'react';
import DocRootLayoutOriginal from '@theme-original/DocRoot/Layout';
import type {Props} from '@theme/DocRoot/Layout';

import SearchModal from '@site/src/components/SearchModal';

export default function DocRootLayout(props: Props): ReactNode {
  return (
    <>
      <div className="docs-toolbar-shell">
        <div className="docs-toolbar">
          <div className="docs-toolbar__search">
            <SearchModal />
          </div>
        </div>
      </div>
      <div className="docs-centered-shell">
        <DocRootLayoutOriginal {...props} />
      </div>
    </>
  );
}
