import { Code } from './Code';

import './WithLineNumbers.scss';

export type WithLineNumbersProps = {
  start: number;
  lines: JSX.Element[][];
}

export function WithLineNumbers({ start, lines }: WithLineNumbersProps) {
  const linesMarkup = lines.map((line, lineNo) => (
    <span key={lineNo} className="line">
      <span>{start + lineNo}</span>
      <span>{line}</span>
    </span>
  ));
  return (
    <Code>{linesMarkup}</Code>
  );
}