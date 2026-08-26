import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useWindowSize} from '@docusaurus/theme-common';
import ContentVisibility from '@theme/ContentVisibility';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocItemContent from '@theme/DocItem/Content';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import type {Props} from '@theme/DocItem/Layout';

import CopyPageMenu from '@site/src/components/CopyPageMenu';

import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  return {
    hidden,
    mobile: canRender ? <DocItemTOCMobile /> : undefined,
    desktop:
      canRender && (windowSize === 'desktop' || windowSize === 'ssr')
        ? <DocItemTOCDesktop />
        : undefined,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();
  const docFooterColumn = 'api' in frontMatter || 'schema' in frontMatter
    ? 'col--7'
    : 'col--12';

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <div className={clsx(styles.docItemContainer, 'docs-page')}>
          <div className="doc-page-actions">
            <CopyPageMenu />
          </div>
          <article>
            <DocBreadcrumbs />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <div className="row">
              <div className={clsx('col', docFooterColumn)}>
                <DocItemFooter />
              </div>
            </div>
          </article>
          <div className="row">
            <div className={clsx('col', docFooterColumn)}>
              <DocItemPaginator />
            </div>
          </div>
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
