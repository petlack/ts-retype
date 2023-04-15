import { refractor } from 'refractor/lib/core.js';
import tsLang from 'refractor/lang/typescript.js';
import { FunctionCandidateType } from './types/candidate';
import ts from 'typescript';
import { range, pipe, slice, split, dropWhile, dropLastWhile, join } from 'ramda';

export function highlight(src: string) {
  if (!refractor.registered('ts')) {
    refractor.register(tsLang);
  }
  return refractor.highlight(src, 'ts');
}

export function getCodeSnippet(
  sourceFile: ts.SourceFile,
  node: { pos: number; end: number } | null,
) {
  const fulltext = sourceFile.getFullText();
  const linesBefore = 1;
  const linesAfter = 1;
  if (!node) {
    return '';
  }
  let start = node.pos;
  while (start >= 0 && fulltext.at(start) !== '\n') {
    start--;
  }
  for (const _ of range(0, linesBefore)) {
    start--;
    while (start >= 0 && fulltext.at(start) !== '\n') {
      start--;
    }
  }
  start = Math.max(0, start);
  let end = node.end;
  for (const _ of range(0, linesAfter + 1)) {
    end++;
    while (end < fulltext.length && fulltext.at(end) !== '\n') {
      end++;
    }
  }
  end = Math.min(fulltext.length, end);
  const isEmptyLine = (line: string) => line.trim().length === 0;
  const nonEmptyLines = pipe(
    slice(start, end),
    split('\n'),
    dropWhile(isEmptyLine),
    dropLastWhile(isEmptyLine),
    join('\n'),
  )(fulltext);
  return nonEmptyLines;
}

export function functionSignatureToStr(
  sig: FunctionCandidateType['signature'],
  { fnName = false, paramName = false } = {},
) {
  if (sig) {
    if (sig.params.length === 1) {
      return `${fnName ? sig.name : ''}(${sig.params
        .map(({ name, type }) => (paramName ? `${name}: ${type}` : type))
        .join(', ')}) => ${sig.return}`;
    }
  }
  return (
    sig &&
    `${fnName ? sig.name : ''}(\n  ${sig.params
      .map(({ name, type }) => (paramName ? `${name}: ${type}` : type))
      .join(',\n  ')}\n) => \n  ${sig.return}`
  );
}
