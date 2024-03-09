import { readFileSync } from 'fs';
import ts from 'typescript';

export function createFile(
    sourceText: string,
): ts.SourceFile {
    return ts.createSourceFile(
        'src.ts',
        sourceText,
        ts.ScriptTarget.Latest,
    );
}

export function getNodeText(
    sourceFile: ts.SourceFile,
    node: { pos: number; end: number } | null,
): string {
    const src = node ?
        sourceFile.getFullText().substring(node.pos, node.end) :
        '<empty_node>';
    return src;
}

export function loadFile(
    path: string,
): ts.SourceFile {
    return ts.createSourceFile(
        path,
        readFileSync(path).toString(),
        ts.ScriptTarget.Latest,
    );
}

export function posToLine(
    lengths: number[],
): (pos: number) => number {
    return function (pos: number) {
        let offset = 0;
        let line = 1;
        for (const len of lengths) {
            offset += len + 1;
            if (pos < offset) {
                return line;
            }
            line += 1;
        }
        return line;
    };
}

export function toName(
    node: ts.Node,
): string {
    if (node && node.kind) {
        return ts.SyntaxKind[node.kind];
    }
    return 'unknown';
}
