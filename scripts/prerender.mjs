// Injects server-rendered markup into the built HTML pages so content is
// present without JavaScript and for crawlers. Run after both builds.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);

const pages = [
  { file: 'dist/index.html', page: 'home' },
  { file: 'dist/case-study/index.html', page: 'case' },
];

for (const { file, page } of pages) {
  const path = resolve(root, file);
  const html = await readFile(path, 'utf8');
  if (!html.includes('<!--app-html-->')) throw new Error(`Placeholder missing in ${file}`);
  await writeFile(path, html.replace('<!--app-html-->', render(page)));
  console.log(`prerendered ${file}`);
}
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true });
