import { Code } from './Code';

export type WithBashProps = {
  lines: JSX.Element[][];
}

export function WithBash({ lines }: WithBashProps) {
  const linesMarkup = lines.map((line, lineNo) => (
    <span key={lineNo} className="line">
      <span>$</span>
      <span>{line}</span>
    </span>
  ));
  return (
    <Code>{linesMarkup}</Code>
  );
}