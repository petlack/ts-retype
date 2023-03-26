import { Code } from './Code';

import './WithLineNumbers.styl';

export type WithLineNumbersProps = {
    children: JSX.Element[];
    start: number;
    lines: number;
}

export function WithLineNumbers({ children, start, lines }: WithLineNumbersProps) {
  const lineNos = [...Array(lines).keys()].map(i => <span key={i}>{i + start}</span>);
  return (
    <>
      <pre className="lines lines-numbers">
        {lineNos}
      </pre>
      <Code>{children}</Code>
    </>
  );
}