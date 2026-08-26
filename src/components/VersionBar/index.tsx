import React from 'react';
import Link from '@docusaurus/Link';
import {
  useActiveDocContext,
  useActivePlugin,
  useDocsVersion,
  useVersions,
} from '@docusaurus/plugin-content-docs/client';

import SearchModal from '@site/src/components/SearchModal';

function versionPath(
  name: string,
  versions: ReturnType<typeof useVersions>,
  alternateDocs: ReturnType<typeof useActiveDocContext>['alternateDocVersions'],
) {
  const version = versions.find((candidate) => candidate.name === name);
  const mainDoc = version?.docs.find((doc) => doc.id === version.mainDocId);
  return alternateDocs[name]?.path ?? mainDoc?.path ?? '/introduction';
}

export default function VersionBar() {
  const activePlugin = useActivePlugin({failfast: true});
  const activeVersion = useDocsVersion();
  const versions = useVersions(activePlugin?.pluginId);
  const {alternateDocVersions} = useActiveDocContext(activePlugin?.pluginId);
  const isV1 = activeVersion.version === '1.0.0';
  const v2Path = versionPath('current', versions, alternateDocVersions);
  const v1Path = versionPath('1.0.0', versions, alternateDocVersions);

  return (
    <div className={`docs-version-bar-shell${isV1 ? ' docs-version-bar-shell--legacy' : ''}`}>
      <div className="docs-version-bar">
        <div className="docs-version-bar__search">
          <SearchModal />
        </div>
        <nav className="docs-version-bar__versions" aria-label="API 文档版本">
          {isV1 ? (
            <Link className="docs-version-bar__version" to={v2Path}>V2</Link>
          ) : (
            <span className="docs-version-bar__version is-active" aria-current="page">V2</span>
          )}
          {isV1 ? (
            <span className="docs-version-bar__version is-active" aria-current="page">
              V1 <small>Legacy</small>
            </span>
          ) : (
            <Link
              className="docs-version-bar__version"
              to={v1Path}
              target="_blank"
              rel="noopener noreferrer">
              V1 <span aria-hidden="true">↗</span>
            </Link>
          )}
        </nav>
        <div className="docs-version-bar__meta">
          {isV1 && (
            <p className="docs-version-bar__notice">
              历史版本 · 请勿与 V2 接口混用
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
