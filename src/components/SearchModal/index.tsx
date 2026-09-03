import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocation} from '@docusaurus/router';
import SearchBar from '@theme/SearchBar';

export default function SearchModal(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
        return;
      }
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(close, [close, location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector<HTMLInputElement>('input')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="docs-search-trigger"
        aria-label="搜索文档"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setIsOpen(true)}>
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d="M6.03 10.2a4.17 4.17 0 1 1 4.17-4.17 4.16 4.16 0 0 1-4.17 4.17Zm5.08-.6a5.88 5.88 0 1 0-1.51 1.3l4.82 4.82a.9.9 0 1 0 1.3-1.3L11.1 9.6Z"
          />
        </svg>
        <span>搜索...</span>
        <kbd>⌘ K</kbd>
      </button>

      {isOpen && typeof document !== 'undefined' ? createPortal(
        <div
          className="docs-search-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}>
          <div
            ref={modalRef}
            className="docs-search-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label="搜索文档">
            <div className="docs-search-modal__search">
              <SearchBar />
              <button
                type="button"
                className="docs-search-modal__close"
                aria-label="关闭搜索"
                onClick={close}>
                Esc
              </button>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
