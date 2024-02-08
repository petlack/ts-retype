import type { Snippet, Token, TokenRoot } from '@ts-retype/search/types';
import { FC } from 'react';

const TOKENS_MAP: Record<string, string> = {
    'bold': 'font-bolder',
    'bash': 'text-sx-bash',
    'builtin': 'text-[color:var(--clr-sx-builtin)]',
    'comment': 'text-[color:var(--clr-sx-comment)]',
    'constant': 'text-sx-constant',
    'class-name': 'text-[color:var(--clr-sx-class-name)]',
    'function': 'text-[color:var(--clr-sx-function)]',
    'keyword': 'text-sx-keyword',
    'number': 'text-[color:var(--clr-sx-number)]',
    'operator': 'text-[color:var(--clr-sx-operator)]',
    'property': 'text-[color:var(--clr-sx-property)]',
    'punctuation': 'text-sx-punctuation',
    'string': 'text-[color:var(--clr-sx-string)]',
};

export const TokenElement: FC<{ children: Token }> = ({ children: token }) => {
    const baseClass = 'font-medium';

    const tokenClass = token.properties?.className?.map(className => TOKENS_MAP[className] || className)
        .join(' ') || 'text-sx-token';

    if (token.type === 'element') {
        return (
            <span>
                {token.children.map((ch, idx) =>
                    <TokenElement key={idx}>{ch}</TokenElement>
                )}
            </span>
        );
    }
    if (token.type === 'newline') {
        return <span>{'\n'}</span>;
    }
    return (
        <span className={`${baseClass} ${tokenClass}`}>
            {token.value}
        </span>
    );
};

export function toTokenRoot(snippet: Snippet) {
    return <TokenRootElement token={snippet.code} />;
}

export const TokenRootElement: FC<{ token: TokenRoot }> = ({ token }) => {
    return <>
        {token.children.map((t, idx) =>
            <TokenElement key={idx}>{t}</TokenElement>
        )}
    </>;
};
