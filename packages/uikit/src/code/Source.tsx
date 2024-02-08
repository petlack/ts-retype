import { Code } from './Code.js';
import { Lines } from './Lines.js';
import { Snippet } from '@ts-retype/search/types';
import { TokenElement } from './TokenElement.js';
import { Window } from './Window.js';
import { parseBash } from './parsers.js';
import { splitLines } from '@ts-retype/search/snippet';

export type SourceProps = {
  children: string;
  lang: 'bash';
  theme: 'dark' | 'light';
}

export function Source({ children, lang = 'bash', theme }: SourceProps) {
    const src = children;

    const parsers = { bash: parseBash };

    if (!(lang in parsers)) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>Language {lang} not supported</p>
            <Code>{children}</Code>
        </div>;
    }

    const parser = parsers[lang];
    const root = parser(src);
    const code = splitLines(root);
    const snippet: Snippet = {
        name: lang,
        lang,
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
