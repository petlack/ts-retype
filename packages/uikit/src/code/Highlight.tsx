import { FC } from 'react';
import { Lines } from './Lines.js';
import type { Snippet } from '@ts-retype/syhi/types';
import { TokenElement } from './TokenElement.js';
import { splitLines } from '@ts-retype/syhi/snippet';

export type HighlightProps = {
    children: Snippet;
    start?: number;
    noLines?: boolean;
}

export const Highlight: FC<HighlightProps> = ({
    children: snippet,
    start,
    noLines,
}) => {
    const markup = splitLines(snippet.code).children.map((token, idx) => (
        <TokenElement key={idx}>{token}</TokenElement>
    ));
    return noLines ?
        <Lines>{markup}</Lines> :
        <Lines type="lineNo" start={start ?? 0}>{markup}</Lines>;
};
