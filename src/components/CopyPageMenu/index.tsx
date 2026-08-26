import React, {useEffect} from 'react';
import CopyPageButton from 'docusaurus-plugin-copy-page-button/react';

import {copyPageButtonProps} from '@site/src/config/copyPage';

function currentMarkdownUrl() {
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  url.pathname = `${url.pathname.replace(/\/$/, '') || '/index'}.md`;
  return url.toString();
}

function openMarkdownPage() {
  const markdownUrl = currentMarkdownUrl();
  if (typeof window.open === 'function') {
    window.open(markdownUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Embedded browsers may intentionally disable window.open.
  const link = document.createElement('a');
  link.href = markdownUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.append(link);
  link.click();
  link.remove();
}

export default function CopyPageMenu(): React.JSX.Element {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const viewAction = target.closest('[data-copy-page-action="view"]');
      if (!viewAction?.closest('.doc-page-actions')) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      openMarkdownPage();
      window.setTimeout(() => {
        document
          .querySelector<HTMLButtonElement>(
            '.doc-page-actions [data-copy-page-button-trigger]',
          )
          ?.click();
      });
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <div>
      <CopyPageButton {...copyPageButtonProps} />
    </div>
  );
}
