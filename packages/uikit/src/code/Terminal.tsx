import { Code } from './Code.js';
import { Lines } from './Lines.js';
import { TokenElement } from './TokenElement.js';
import { parseBash } from './parsers.js';
import { splitLines } from '@ts-retype/search/snippet';

export type TerminalProps = {
  children: string | string[];
  lang?: 'bash';
  theme?: 'dark' | 'light';
}

export function Terminal({ children, lang = 'bash' }: TerminalProps) {
    const src = children;

    const parsers = { bash: parseBash };

    if (!(lang in parsers)) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>Language {lang} not supported</p>
            <Code>
                {children}
            </Code>
        </div>;
    }

    const parser = parsers[lang];
    const root = parser(Array.isArray(src) ? src.join('\n') : src);

    return (
        <Lines type="custom" prefix="$">
            {splitLines(root).children.map((token, idx) => (
                <TokenElement key={idx}>{token}</TokenElement>
            ))}
        </Lines>
    );
}
