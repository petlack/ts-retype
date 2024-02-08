import { TokenElement } from './TokenElement.js';
import type { Snippet } from '@ts-retype/search/types';
import { Lines } from './Lines.js';
import { splitLines } from '@ts-retype/search/snippet';

export type TypeScriptProps = {
  children: Snippet;
  start?: number;
}

export function TypeScript({ start, children: snippet }: TypeScriptProps) {
    return (
        <Lines type="lineNo" start={start ?? 0}>
            {splitLines(snippet.code).children.map((token, idx) => (
                <TokenElement key={idx}>{token}</TokenElement>
            ))}
        </Lines>
    );
}
