import fs from 'fs';
import path from 'path';
import { refractor } from 'refractor/lib/core.js';
import ts from 'refractor/lang/typescript.js';
import json from 'refractor/lang/json.js';

refractor.register(ts);
refractor.register(json);

const sourceDir = path.join(process.cwd(), '../src/snippets');
const targetDir = path.join(process.cwd(), '../src/generated');

function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function loadSnippets(snippetsFolderPath: string) {
  return fs
    .readdirSync(snippetsFolderPath)
    .map((fileName) => fileName.split('.'))
    .map(([name, lang]) => ({
      name,
      lang,
      code: refractor.highlight(
        fs.readFileSync(path.join(snippetsFolderPath, `${name}.${lang}`)).toString(),
        lang,
      ),
    }))
    .reduce((res, item) => ({ ...res, [item.name]: item }), {});
}

console.log('generating syntax highlighted snippets');

const snippets = loadSnippets(sourceDir);

console.log(snippets);

ensureDirectoryExists(targetDir);
fs.writeFileSync(
  path.join(targetDir, 'snippets.ts'),
  `export default ${JSON.stringify(snippets, null, 2)}`,
);

console.log('done');
