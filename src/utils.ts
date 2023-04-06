import { readFileSync } from 'fs';
import path from 'path';
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

export function getNodeText(sourceFile: ts.SourceFile, node: { pos: number; end: number } | null) {
  const src = node ? sourceFile.getFullText().substring(node.pos, node.end) : '<empty_node>';
  return src;
}

export function posToLine(lengths: number[]) {
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

export const pwd = (p: string) => path.join(process.cwd(), p);
export const dir = (p: string) => path.join(__dirname, p);

export const stringify = (args: unknown) =>
  JSON.stringify(
    args,
    (_key, value) =>
      Array.isArray(value) ? `[${value.map((v) => '"' + v + '"').join(',')}]` : value,
    2,
  )
    .replace(/"\[/g, '[')
    .replace(/\]"/g, ']')
    .replace(/\\"/g, '"');

export function filterEmpty<T extends object>(obj: T): Partial<T> {
  return <Partial<T>>Object.fromEntries(Object.entries(obj).filter(([, v]) => !!v));
}

export function formatDuration(ms: number) {
  let sec = ms / 1000;
  if (sec < 60) {
    return `${sec.toFixed(2)}s`;
  }
  let min = Math.floor(sec / 60);
  sec -= min * 60;
  if (min < 60) {
    return `${min}m ${sec.toFixed(2)}s`;
  }
  const hours = Math.floor(min / 60);
  min -= hours * 60;
  return `${hours}h ${min}m ${sec.toFixed(2)}`;
}

type Freq = { [k in string | number | symbol]: number };

export function freq(list: (string | number | symbol)[]) {
  const map = list.reduce((res, item) => {
    res[item] = (res[item] || 0) + 1;
    return res;
  }, <Freq>{});
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

export function selectIndices<T>(arr: T[], indices: Iterable<number>): T[] {
  const result: T[] = [];
  for (const index of indices) {
    if (index >= 0 && index < arr.length) {
      result.push(arr[index]);
    }
  }
  return result;
}
