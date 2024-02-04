import type { Snippet, Token, TokenRoot } from '@ts-retype/search/types';
import { FC } from 'react';

export const TokenElement: FC<{ token: Token }> = ({ token }) => {
    if (token.type === 'element') {
        return (
            <span>
                {token.children.map((ch, idx) => <TokenElement key={idx} token={ch as Token} />)}
            </span>
        );
    }
    if (token.type === 'newline') {
        return (
            <span>{'\n'}</span>
        );
    }
    return (
        <span className={['token', ...(token.properties?.className || [])].join(' ')}>
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
