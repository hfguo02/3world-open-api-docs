import {readdir, readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const {extractPageMarkdownFromHtml} = require(
  'docusaurus-plugin-copy-page-button/src/htmlToMarkdown.js',
);

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(entryPath);
      return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
    }),
  );
  return files.flat();
}

function canonicalUrl(html) {
  const canonicalTag = html
    .match(/<link\b[^>]*>/gi)
    ?.find((tag) => /\brel=["']canonical["']/i.test(tag));
  return canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
}

function markdownPath(htmlPath, outDir) {
  const relativePath = path.relative(outDir, htmlPath);
  if (relativePath === 'index.html') return path.join(outDir, 'index.md');
  if (path.basename(relativePath) === 'index.html') {
    return path.join(outDir, `${path.dirname(relativePath)}.md`);
  }
  return path.join(outDir, relativePath.replace(/\.html$/, '.md'));
}

async function writeMarkdown(htmlPath, outDir) {
  const html = await readFile(htmlPath, 'utf8');
  const pageUrl = canonicalUrl(html);
  const markdown = pageUrl
    ? extractPageMarkdownFromHtml(html, pageUrl, {requireDocContent: true})
    : '';
  if (!markdown.trim()) return false;

  await writeFile(markdownPath(htmlPath, outDir), `${markdown.trim()}\n`, 'utf8');
  return true;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, '..');
const outDir = path.resolve(siteDir, process.argv[2] ?? 'build');
const htmlFiles = await collectHtmlFiles(outDir);
const results = await Promise.all(
  htmlFiles.map((htmlPath) => writeMarkdown(htmlPath, outDir)),
);

console.log(`已重写 ${results.filter(Boolean).length} 个文档 Markdown 路由。`);
