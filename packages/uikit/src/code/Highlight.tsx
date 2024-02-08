import { Lines } from './Lines.js';
import type { Snippet } from '@ts-retype/search/types';
import { TokenElement } from './TokenElement.js';
import { splitLines } from '@ts-retype/search/snippet';

export type HighlightProps = {
  children: Snippet;
  start?: number;
}

export function Highlight({ start, children: snippet }: HighlightProps) {
    return (
        <Lines type="lineNo" start={start ?? 0}>
            {splitLines(snippet.code).children.map((token, idx) => (
                <TokenElement key={idx}>{token}</TokenElement>
            ))}
        </Lines>
    );
}
