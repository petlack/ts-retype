import type { Snippet, Token, TokenRoot } from '@ts-retype/retype';
import './Token.scss';

export function toTokenRoot(snippet: Snippet) {
  return <TokenRootElement token={snippet.code} />;
}

export function TokenRootElement({ token }: { token: TokenRoot }) {
  return <>{token.children.map((t, idx) => <TokenElement key={idx} token={t} />)}</>;
}

export function TokenElement({ token }: { token: Token }) {
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
}