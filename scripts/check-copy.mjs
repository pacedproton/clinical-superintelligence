// Editorial guard: the house style uses ordinary hyphens, never em or en dashes.
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['src', 'index.html', 'case-study', 'public', 'dist'];
const bad = /[–—]|\\u201[34]|&mdash;|&ndash;/;
let failures = 0;

async function walk(p) {
  let entries;
  try {
    entries = await readdir(p, { withFileTypes: true });
  } catch {
    return [p];
  }
  const out = [];
  for (const e of entries) out.push(...(await walk(join(p, e.name))));
  return out;
}

for (const t of targets) {
  for (const f of await walk(join(root, t))) {
    if (!/\.(tsx?|css|html|js|xml|txt|svg|json)$/.test(f)) continue;
    let text;
    try { text = await readFile(f, 'utf8'); } catch { continue; }
    text.split('\n').forEach((line, i) => {
      if (bad.test(line) && !/assets\/.*\.js$/.test(f)) {
        failures++;
        console.log(`${f.replace(root + '/', '')}:${i + 1}: ${line.trim().slice(0, 100)}`);
      }
    });
  }
}
if (failures) {
  console.error(`\n${failures} line(s) contain em or en dashes.`);
  process.exit(1);
}
console.log('copy check passed: no em or en dashes');
