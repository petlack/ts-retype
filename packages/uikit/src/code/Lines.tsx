import { FC, PropsWithChildren, ReactNode } from 'react';
import { Code } from './Code.js';
import { clsx } from '../clsx.js';

type LinesLineNoProps = {
    type?: 'lineNo';
    start: number;
}

type LinesCustomPrefixProps = {
    type?: 'custom';
    prefix: string;
}

type LinesRawProps = {
    type?: 'raw';
}

export type LinesProps = {
    children: ReactNode | ReactNode[];
    className?: string;
} & (LinesLineNoProps | LinesCustomPrefixProps | LinesRawProps);

export const Lines: FC<PropsWithChildren<LinesProps>> = ({ children: anyChildren, className, ...props }) => {
    const children = Array.isArray(anyChildren) ? anyChildren : [anyChildren];
    return (
        <Code className={clsx(
            className,
            'grid gap-x-3',
            props.type === 'lineNo' ? 'grid-cols-lines-numbers' : null,
            props.type === 'custom' ? 'grid-cols-lines-char' : null,
        )}>
            {children.map((line, lineNo) => (
                <Line key={lineNo} idx={lineNo} {...props}>
                    {line}
                </Line>
            ))}
        </Code>
    );
};

export const Line: FC<PropsWithChildren<LinesProps & {
    idx: number;
    children: ReactNode;
    className?: string;
}>> = ({ idx, children, ...props }) => {
    let prefixMarkup = null;

    switch (props.type) {
    case 'lineNo':
        prefixMarkup = props.start + idx;
        break;
    case 'custom':
        prefixMarkup = props.prefix;
        break;
    }

    const prefixStyle = clsx(
        'cursor-default select-none',
        'inline-block',
        'text-code-comment text-right font-light',
    );

    return <>
        {prefixMarkup != null && <span className={prefixStyle}>{prefixMarkup}</span>}
        {children}
    </>;
};
