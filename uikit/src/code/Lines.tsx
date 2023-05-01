import { Code } from './Code';

import './Lines.scss';

type LinesLineNoProps = {
  type: 'lineNo';
  start: number;
}

type LinesCustomCharProps = {
  type: 'custom';
  char: string;
}

export type LinesProps = {
  lines: JSX.Element[];
} & (LinesLineNoProps | LinesCustomCharProps);

export function Lines(props: LinesProps) {
  const linesMarkup = props.lines.map((line, lineNo) => (
    <span key={lineNo} className="line">
      <span>{props.type === 'lineNo' ? props.start + lineNo : props.char}</span>
      {line}
    </span>
  ));
  return (
    <Code>{linesMarkup}</Code>
  );
}