import {readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, '..');
const generatedDirs = [
  path.join(siteDir, 'docs/api'),
  path.join(siteDir, 'versioned_docs/version-1.0.0/api'),
];

function frontMatterString(source, key) {
  const match = source.match(new RegExp(`^${key}: ("(?:[^"\\\\]|\\\\.)*")$`, 'm'));
  return match ? JSON.parse(match[1]) : undefined;
}

function normalized(value) {
  return value.trim().replace(/[。.!！]+$/u, '').trim();
}

function removeRedundantDescription(source, filePath) {
  const title = frontMatterString(source, 'title');
  if (!title) throw new Error(`API 文档缺少标题：${filePath}`);

  const methodEnd = source.indexOf('</MethodEndpoint>');
  if (methodEnd < 0) throw new Error(`API 文档缺少 MethodEndpoint：${filePath}`);

  const nextHeading = source.indexOf('<Heading', methodEnd + 1);
  const sectionEnd = nextHeading < 0 ? source.length : nextHeading;
  const prefix = source.slice(0, methodEnd + '</MethodEndpoint>'.length);
  const descriptionBlock = source.slice(
    methodEnd + '</MethodEndpoint>'.length,
    sectionEnd,
  );
  const suffix = source.slice(sectionEnd);
  const lines = descriptionBlock.split('\n');
  const titleText = normalized(title);
  let removed = 0;
  const kept = lines.filter((line) => {
    if (!line.trim() || normalized(line) !== titleText) return true;
    removed += 1;
    return false;
  });

  if (removed > 1) {
    throw new Error(`API 文档出现多个重复描述：${filePath}`);
  }
  return {source: `${prefix}${kept.join('\n')}${suffix}`, removed};
}

let processed = 0;
for (const generatedDir of generatedDirs) {
  const entries = await readdir(generatedDir, {withFileTypes: true});
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.api.mdx')) continue;
    const filePath = path.join(generatedDir, entry.name);
    const source = await readFile(filePath, 'utf8');
    const result = removeRedundantDescription(source, filePath);
    if (result.removed === 0) continue;
    await writeFile(filePath, result.source);
    processed += 1;
  }
}

console.log(`Removed redundant descriptions from ${processed} generated API pages`);
