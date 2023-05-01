import type { Snippet, Token, TokenRoot, TokenText } from '@ts-retype/retype';
import './Token.styl';

function startsWithNewline(token: Token): token is TokenText {
  return token.type === 'text' && token.value.startsWith('\n');
}

export function insertNewlines(root: TokenRoot): TokenRoot {
  const newLine: Token = { type: 'newline' };
  const withNewLines = root.children.reduce(
    (res, item) => [
      ...res,
      ...(
        startsWithNewline(item) ?
          [newLine, { ...item, value: item.value.replace('\n', '') }] :
          [item]
      ),
    ],
    [] as Token[],
  );
  const code: TokenRoot = {
    type: 'root',
    children: withNewLines || [],
  };
  return code;
}

export function toTokenRoot(snippet: Snippet) {
  return <TokenRootElement token={snippet.code} />;
}

function splitAt<T>(arr: T[], predicate: (t: T) => boolean) {
  const result = [];
  let startIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result.push(arr.slice(startIndex, i));
      startIndex = i + 1;
    }
  }
  result.push(arr.slice(startIndex));
  return result;
}

export function toTokenLines(snippet: Snippet) {
  const withNewLines = insertNewlines(snippet.code);
  return splitAt(withNewLines.children || [], t => t.type === 'newline');
}

export function splitLines(root: TokenRoot): TokenRoot {
  const withNewLines = insertNewlines(root);
  const lines = splitAt(withNewLines.children || [], t => t.type === 'newline');
  return {
    type: 'root',
    children: lines.map(tokens => ({ type: 'element', children: tokens } as Token)),
  };
}

export function flattenTokens(root: TokenRoot): TokenRoot {
  function flatten(token: Token): Token[] {
    if (token.type === 'element') {
      return token.children.reduce(
        (res, item) => [...res, ...flatten({ ...token, ...item } as Token)],
        [] as Token[],
      );
    }
    return [token];
  }
  return {
    type: 'root',
    children: flatten({ type: 'element', children: root.children }),
  };
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