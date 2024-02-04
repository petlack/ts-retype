import { FC, PropsWithChildren } from 'react';

import { Code } from '../Code/index.js';

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

export const Lines: FC<PropsWithChildren<LinesProps>> = (props) => {
    const linesMarkup = props.lines.map((line, lineNo) => (
        <span key={lineNo}>
            <span className="text-neutral-400 px-2 py-0 cursor-default select-none text-right font-light">{props.type === 'lineNo' ? props.start + lineNo : props.char}</span>
            {line}
        </span>
    ));
    return (
        <Code>{linesMarkup}</Code>
    );
};
