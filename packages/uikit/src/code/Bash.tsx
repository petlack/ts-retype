import type { Snippet, Token, TokenRoot } from '@ts-retype/search/types';
import { Lines } from './Lines.js';
import { PropsWithChildren } from 'react';
import { TokenElement } from './TokenElement.js';
import { Window } from './Window.js';
import { splitLines } from '@ts-retype/search/snippet';

export type BashProps = PropsWithChildren<{
  children: string;
  theme: 'dark' | 'light';
}>

function parseBash(code: string): TokenRoot {
    const lines = code.split('\n')
        .map(line => [
            line.trim().startsWith('#') ?
      {
          type: 'element',
          properties: { className: ['token', 'comment'] },
          children: [{ type: 'text', value: line }],
      } as Token :
      {
          type: 'element',
          properties: { className: ['token', 'bold', 'bash'] },
          children: [{ type: 'text', value: line }],
      } as Token,
      { type: 'newline' } as Token
        ])
        .reduce((res, item) => [...res, ...item], []);

    return {
        type: 'root',
        children: lines.slice(0, -1),
    };
}

export function Bash({ children, theme }: BashProps) {
    const src = children;

    const root = parseBash(src);
    const code = splitLines(root);
    const snippet: Snippet = {
        name: 'bash',
        lang: 'bash',
        code,
    };
    return (
        <Window theme={theme} name="bash" forceHeader={false}>
            <Lines type="custom" prefix="$">
                {snippet.code.children.map((token, idx) => (
                    <TokenElement key={idx}>{token}</TokenElement>
                ))}
            </Lines>
        </Window>
    );
}
