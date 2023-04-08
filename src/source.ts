import { refractor } from 'refractor/lib/core.js';
import ts from 'refractor/lang/typescript.js';
import { FunctionCandidateType } from './types';

refractor.register(ts);

export function highlight(src: string) {
  return refractor.highlight(src, 'ts');
}

export function fixIndentation(src: string) {
  let indentLevel = 0;
  const INDENT_SIZE = 2;
  const INDENT = ' '.repeat(INDENT_SIZE);

  const lines = src.split('\n');
  return lines
    .map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) {
        return '';
      }

      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')')) {
        indentLevel--;
      }

      const indent = INDENT.repeat(indentLevel);
      const indentedLine = `${indent}${trimmedLine}`;

      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('(')) {
        indentLevel++;
      }

      return indentedLine;
    })
    .join('\n');
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
