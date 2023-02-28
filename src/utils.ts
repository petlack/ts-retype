import { readFileSync } from 'fs';
import ts from 'typescript';

export function toName(node: ts.Node): string {
  if (node && node.kind) {
    return ts.SyntaxKind[node.kind];
  }
  return 'unknown';
}

export function createFile(sourceText: string) {
  return ts.createSourceFile('src.ts', sourceText, ts.ScriptTarget.Latest);
}

export function loadFile(path: string) {
  return ts.createSourceFile(path, readFileSync(path).toString(), ts.ScriptTarget.Latest);
}
