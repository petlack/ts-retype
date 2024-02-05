import type { Snippet, Token, TokenRoot } from '@ts-retype/search/types';
import { FC } from 'react';

export const TokenElement: FC<{ token: Token }> = ({ token }) => {
    const baseClass = 'font-medium';

    const tokenClass = token.properties?.className?.map(className =>
        ({
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
        })[className] || className
    ).join(' ') || 'text-sx-token';

    if (token.type === 'element') {
        return (
            <span>
                {token.children.map((ch, idx) => <TokenElement key={idx} token={ch as Token} />)}
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
    return <>{token.children.map((t, idx) => <TokenElement key={idx} token={t} />)}</>;
};
