import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, parse, resolve } from 'path';
import { createCommand } from 'commander';
import { refractor } from 'refractor/lib/core.js';
import ts from 'refractor/lang/typescript.js';
import json from 'refractor/lang/json.js';
import { run } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = { dir?: string; list?: string; output: string };

const program = createCommand();

program
  .name('syntaxHighlighting')
  .description('generate Snippet from TS file')
  .option('-d, --dir <path>', 'generate Snippet for each file in a directory')
  .option('-l, --list <path>', 'generate Snippet for each file in a list of files in given path')
  .option('-o, --output <path>', 'file to save generated Snippets');

function parseCmdProps(): Partial<CmdProps> {
  program.parse();
  const options = program.opts();
  return options;
}

function ensureDirectoryExists(directory: string) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}

function listFiles(sourceDir: string) {
  return readdirSync(sourceDir).map((file) => join(sourceDir, file));
}

function loadSnippets(snippets: string[]) {
  return snippets
    .map((fileName) => parse(resolve(fileName)))
    .map(({ dir, name, ext }) => ({ dir, name, ext: ext.slice(1) }))
    .map(({ dir, name, ext }) => ({
      name,
      lang: ext,
      code: refractor.highlight(readFileSync(join(dir, `${name}.${ext}`)).toString(), ext),
    }));
}

export function syntaxHighlighting(config: CmdProps) {
  if (!config.output) {
    console.log('Missing output');
    throw new Error('Missing output');
  }

  refractor.register(ts);
  refractor.register(json);

  console.log('generating syntax highlighted snippets');

  const files = config.dir ? listFiles(config.dir) : [];

  const targetDir = config.output;
  ensureDirectoryExists(targetDir);

  const snippets = loadSnippets(files);
  const exports = snippets.map(
    (snippet) => `export const Snippet_${snippet.name} = ${JSON.stringify(snippet)};`,
  );
  writeFileSync(join(targetDir, 'snippets.ts'), exports.join('\n\n'));
}

function main() {
  const config = parseCmdProps() as CmdProps;

  try {
    syntaxHighlighting(config);
  } catch (e: any) {
    console.log(e.message);
    program.outputHelp();
    process.exit(1);
  }

  console.log('done');
}

if (isMain(import.meta)) {
  run(main);
}
