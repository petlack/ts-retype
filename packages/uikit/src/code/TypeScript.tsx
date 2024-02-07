import { Window } from './Window.js';
import { TokenElement } from './TokenElement.js';
import type { Snippet } from '@ts-retype/search/types';
import { Lines } from './Lines.js';
import { splitLines } from '@ts-retype/search/snippet';

export type TypeScriptProps = {
  start: number;
  name: string;
  theme: 'light' | 'dark';
  snippet: Snippet;
  responsive?: boolean;
}

export function TypeScript({ start, name, snippet, theme, responsive = false }: TypeScriptProps) {
    const sn: Snippet = {
        name,
        lang: 'ts',
        code: splitLines(snippet.code),
    };
    const linesMarkup = sn.code.children.map((token, idx) => (
        <TokenElement
            key={idx}
            token={token}
        />
    ));
    return (
        <Window
            responsive={responsive}
            name={name}
            theme={theme}
        >
            <Lines
                type="lineNo"
                start={start}
                lines={linesMarkup}
            />
        </Window>
    );
}
