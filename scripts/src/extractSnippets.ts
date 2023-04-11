import { createCommand } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import {
  always,
  dropLastWhile,
  dropWhile,
  evolve,
  head,
  join,
  map,
  omit,
  pipe,
  split,
} from 'ramda';
import ts from 'typescript';
import { ReportResult } from '../../src/types';
import { run } from './cmd.js';
import { isMain } from './isMain.js';
import { stringifyNice } from './stringify.js';

type CmdProps = { verbose?: boolean };

const program = createCommand();

program
  .name('extractSnippets')
  .description('extract snippets from source files to destination files');

function parseCmdProps(): Partial<CmdProps> {
  program.parse();
  const options = program.opts();
  return options;
}

function findNode(srcFile: ts.SourceFile, name: string): ts.Node | null {
  let targetNode: ts.Node | null = null;

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText() === name) {
      targetNode = node;
    } else if (ts.isInterfaceDeclaration(node) && node.name.getText() === name) {
      targetNode = node;
    } else if (ts.isTypeAliasDeclaration(node) && node.name.escapedText === name) {
      targetNode = node;
    } else if (ts.isClassDeclaration(node) && node.name?.getText() === name) {
      targetNode = node;
    }

    if (!targetNode) {
      ts.forEachChild(node, visit);
    }
  }

  visit(srcFile);

  return targetNode;
}

export function getNodeText(sourceFile: ts.SourceFile, node: { pos: number; end: number } | null) {
  const src = node ? sourceFile.getFullText().substring(node.pos, node.end) : '<empty_node>';
  return src;
}

type SnippetNeedle = {
  src: string;
  dst: string;
  name?: string;
  lines?: [number, number];
  transform?: (src: string) => string;
};

function trimEmptyLines(src: string): string {
  const isEmptyLine = (l: string) => !l.trim().length;
  return pipe(split('\n'), dropWhile(isEmptyLine), dropLastWhile(isEmptyLine), join('\n'))(src);
}

function findSnippet(needle: SnippetNeedle) {
  const fileContents = readFileSync(needle.src).toString();
  const srcFile = ts.createSourceFile(needle.src, fileContents, ts.ScriptTarget.Latest);

  let src: string | null = null;
  if (needle.name) {
    const ast = findNode(srcFile, needle.name);
    src = getNodeText(srcFile, ast);
  } else if (needle.lines) {
    src = pipe(
      split('\n'),
      (a) => a.slice(needle.lines[0] - 1, needle.lines[1]),
      join('\n'),
    )(fileContents);
  } else if (needle.transform) {
    src = needle.transform(fileContents);
  } else {
    src = fileContents;
  }

  return trimEmptyLines(src);
}

function selectDuplicate(src: string) {
  const asJson = <ReportResult>JSON.parse(src);
  const { data } = asJson;
  const res = pipe(
    head,
    evolve({
      files: map(
        pipe(
          omit(['srcHgl']),
          evolve({
            src: always('...omitted...'),
            properties: map(omit(['text'])),
          }),
        ),
      ),
    }),
  )(data);
  const code = stringifyNice(res);
  return `import { TypeDuplicate } from 'ts-retype';

export const duplicate: TypeDuplicate = ${code};
`;
}

export function extractSnippets(config: CmdProps) {
  const snippets: SnippetNeedle[] = [
    {
      src: '../src/types/duplicate.ts',
      dst: '../docs/src/snippets/TypeDuplicate.ts',
      name: 'TypeDuplicate',
    },
    { src: '../example/src/index.ts', dst: '../docs/src/snippets/tsRetype.ts' },
    { src: '../example/src/api.ts', dst: '../docs/src/snippets/function.ts', lines: [16, 25] },
    { src: '../example/src/auth.ts', dst: '../docs/src/snippets/interface.ts', lines: [2, 8] },
    { src: '../example/src/model.ts', dst: '../docs/src/snippets/type.ts', lines: [5, 11] },
    { src: '../src/types/props.ts', dst: '../docs/src/snippets/ScanProps.ts', name: 'ScanProps' },
    { src: '../.retyperc', dst: '../docs/src/snippets/retyperc.json' },
    {
      src: '../example/data.json',
      dst: '../docs/src/snippets/duplicate.ts',
      transform: selectDuplicate,
    },
  ];

  console.log(snippets);

  for (const snippet of snippets) {
    console.log(`writing ${snippet.dst}`);
    const code = findSnippet(snippet);
    writeFileSync(snippet.dst, code);
  }
}

function main() {
  const config = parseCmdProps() as CmdProps;

  try {
    extractSnippets(config);
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
