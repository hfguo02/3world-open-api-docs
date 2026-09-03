import {mkdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, '..');
const generatedDirs = [path.join(siteDir, 'docs/api')];

for (const generatedDir of generatedDirs) {
  if (path.basename(generatedDir) !== 'api') {
    throw new Error(`拒绝清理非 API 生成目录：${generatedDir}`);
  }
  await rm(generatedDir, {recursive: true, force: true});
  await mkdir(generatedDir, {recursive: true});
}
