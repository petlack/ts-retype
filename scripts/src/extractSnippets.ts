import colors from 'colors';
import { createCommand } from 'commander';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
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
import type { ReportResult } from '@ts-retype/retype';
import { BaseCmdProps, execute } from './cmd.js';
import { isMain } from './isMain.js';
import { getRootDir } from './paths.js';
import { Json, stringifyNice } from './stringify.js';

type CmdProps = BaseCmdProps;

const log = console.log.bind(console, '[extractSnippets]');

const program = createCommand();

program
  .name('extractSnippets')
  .description('extract snippets from source files to destination files');

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

async function findSnippet(needle: SnippetNeedle) {
  const fileContents = (await readFile(needle.src)).toString();
  const srcFile = ts.createSourceFile(needle.src, fileContents, ts.ScriptTarget.Latest);

  let src: string | null = null;
  if (needle.name) {
    const ast = findNode(srcFile, needle.name);
    src = getNodeText(srcFile, ast);
  } else if (needle.lines) {
    const [start, end] = needle.lines;
    src = pipe(split('\n'), (a) => a.slice(start - 1, end), join('\n'))(fileContents);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    evolve({
      files: map(
        pipe(
          omit(['srcHgl']),
          evolve({
            src: always('...omitted...'),
          }),
        ),
      ),
    }),
  )(data) as Json;
  const code = stringifyNice(res);
  return `import { TypeDuplicate } from '@ts-retype/retype';

export const duplicate: TypeDuplicate = ${code};
`;
}

export async function extractSnippets() {
  const snippets: SnippetNeedle[] = [
    {
      src: 'retype/src/types/duplicate.ts',
      dst: 'docs/src/snippets/TypeDuplicate.ts',
      name: 'TypeDuplicate',
    },
    { src: 'example/src/index.ts', dst: 'docs/src/snippets/tsRetype.ts' },
    { src: 'example/src/api.ts', dst: 'docs/src/snippets/function.ts', lines: [16, 25] },
    { src: 'example/src/auth.ts', dst: 'docs/src/snippets/interface.ts', lines: [2, 8] },
    { src: 'example/src/model.ts', dst: 'docs/src/snippets/type.ts', lines: [5, 11] },
    { src: 'retype/src/types/props.ts', dst: 'docs/src/snippets/ScanProps.ts', name: 'ScanProps' },
    { src: '.retyperc', dst: 'docs/src/snippets/retyperc.json' },
    {
      src: 'example/data.json',
      dst: 'example/src/duplicate.ts',
      transform: selectDuplicate,
    },
    {
      src: 'example/src/duplicate.ts',
      dst: 'docs/src/snippets/duplicate.ts',
    },
  ];

  const rootDir = await getRootDir();

  if (!rootDir) {
    log(colors.red('could not find root dir'));
    return;
  }

  for (const snippet of snippets) {
    snippet.src = path.join(rootDir, snippet.src);
    snippet.dst = path.join(rootDir, snippet.dst);
    console.log(`writing ${snippet.dst}`);
    const code = await findSnippet(snippet);
    await writeFile(snippet.dst, code);
  }
}

if (isMain(import.meta)) {
  execute(program, extractSnippets);
}
