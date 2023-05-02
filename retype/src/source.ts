import { RefractorRoot, refractor } from 'refractor/lib/core.js';
import tsLang from 'refractor/lang/typescript.js';
import { FunctionCandidateType } from './types/candidate';
import ts from 'typescript';
import { range, slice } from 'ramda';
import { TokenRoot } from './types';
import { flattenTokens, insertNewlines, filterEmpty } from './snippet';

export function refractorHighlight(src: string): RefractorRoot {
  if (!refractor.registered('ts')) {
    refractor.register(tsLang);
  }
  return refractor.highlight(src, 'ts');
}

export function highlight(src: string): TokenRoot {
  const refractorRoot = refractorHighlight(src);
  const tokenRoot: TokenRoot = refractorRoot as TokenRoot;
  return filterEmpty(insertNewlines(flattenTokens(tokenRoot)));
}

export function getCodeSnippet(srcFile: ts.SourceFile, node: ts.Node) {
  const [startAt, endBefore] = [node.getStart(srcFile), node.getEnd()];
  const fulltext = srcFile.getFullText();
  const linesBefore = 1;
  const linesAfter = 1;
  if (!node) {
    return { src: '', startAt: 0, endBefore: 0, leftOffset: 0, rightOffset: 0 };
  }
  let leftOffset = 0;
  while (startAt + leftOffset >= 0 && fulltext.at(startAt + leftOffset) !== '\n') {
    leftOffset--;
  }
  for (const _ of range(0, linesBefore)) {
    leftOffset--;
    while (startAt + leftOffset >= 0 && fulltext.at(startAt + leftOffset) !== '\n') {
      leftOffset--;
    }
  }
  leftOffset++;

  let rightOffset = 0;
  for (const _ of range(0, linesAfter + 1)) {
    rightOffset++;
    while (
      endBefore + rightOffset < fulltext.length &&
      fulltext.at(endBefore + rightOffset) !== '\n'
    ) {
      rightOffset++;
    }
  }

  leftOffset = leftOffset + startAt < 0 ? -1 * startAt : leftOffset;
  rightOffset =
    endBefore + rightOffset > fulltext.length ? fulltext.length - endBefore : rightOffset;
  const nonEmptyLines = slice(startAt + leftOffset, endBefore + rightOffset, fulltext);
  return { src: nonEmptyLines, startAt, endBefore, leftOffset, rightOffset };
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
