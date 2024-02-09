import { readFileSync, writeFileSync } from 'fs';
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
import type { ReportResult } from '@ts-retype/search/types';
import { createLogger } from '@ts-retype/utils';
import { Json, stringifyNice } from './stringify.js';

// eslint-disable-next-line no-console
const log = createLogger(console.log);

export type ExtractSnippetsArgs = {
    rootDir: string;
    output: string;
}

export async function extractSnippets({ rootDir, output }: ExtractSnippetsArgs) {
    const snippets: SnippetNeedle[] = [
        { src: '.retyperc', dst: 'retyperc.json' },
        { src: 'packages/search/src/types/duplicate.ts', dst: 'TypeDuplicate.ts', name: 'TypeDuplicate' },
        { src: 'packages/search/src/types/props.ts', dst: 'ScanProps.ts', name: 'ScanProps' },
        { src: 'tests/example/src/api.ts', dst: 'function.ts', lines: [16, 25] },
        { src: 'tests/example/src/auth.ts', dst: 'interface.ts', lines: [2, 8] },
        { src: 'tests/example/src/index.ts', dst: 'tsRetype.ts' },
        { src: 'tests/example/src/model.ts', dst: 'type.ts', lines: [5, 11] },
        { src: 'tests/example/src/duplicate.ts', dst: 'duplicate.ts' },
        {
            src: 'tests/example/data.json',
            dst: `${rootDir}/tests/example/src/duplicate.ts`,
            transform: selectDuplicate,
        },
    ];

    if (!rootDir) {
        log.log('Could not find root dir');
        return;
    }

    for (const snippet of snippets) {
        snippet.src = path.join(rootDir, snippet.src);
        snippet.dst = path.isAbsolute(snippet.dst) ? snippet.dst : path.join(output, snippet.dst);
        log.log(`writing ${snippet.dst}`);
        const code = await findSnippet(snippet);
        writeFileSync(snippet.dst, code);
    }
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
    return `import type { TypeDuplicate } from '@ts-retype/search';

export const duplicate: TypeDuplicate = ${code};
`;
}

async function findSnippet(needle: SnippetNeedle) {
    const fileContents = readFileSync(needle.src).toString();
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
    return pipe(
        split('\n'),
        dropWhile(isEmptyLine),
        dropLastWhile(isEmptyLine),
        join('\n'),
    )(src);
}
