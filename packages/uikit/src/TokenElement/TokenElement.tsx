import type { Snippet, Token, TokenRoot } from '@ts-retype/search/types';
import { FC } from 'react';

export const TokenElement: FC<{ token: Token }> = ({ token }) => {
    const baseClass = 'font-medium text-sx-token'; // Base class for token

    // Determine additional classes based on token type
    const tokenClass = token.properties?.className?.map(className =>
        ({
            'bold': 'font-bolder',
            'bash': 'text-sx-bash',
            'builtin': 'text-sx-builtin',
            'comment': 'text-sx-comment',
            'class-name': 'text-sx-class-name',
            'function': 'text-sx-function',
            'keyword': 'text-sx-keyword',
            'number': 'text-sx-number',
            'operator': 'text-sx-operator',
            'property': 'text-sx-property',
            'punctuation': 'text-sx-punctuation',
            'string': 'text-sx-string',
        })[className] || className // Fallback to original className if no match
    ).join(' ') || '';

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
