import { Snippet, Token } from '../../../src/types/snippet';
import './Token.styl';

export function insertNewlines(snippet: Snippet): Snippet {
  const withNewLines = snippet.code.children.reduce(
    (res, item) => [...res, ...(item.value?.startsWith('\n') ? [{ type: 'newline' } as Token, { ...item, value: item.value.replace('\n', '') }] : [item])],
    [] as Token[],
  );
  return {
    ...snippet,
    code: {
      ...snippet.code,
      children: withNewLines,
    },
  };
}

function toTokenElement(token: Token, idx: number) {
  return <TokenElement key={idx} token={token} />;
}

export function toTokenElements(snippet: Snippet) {
  return snippet.code.children.map(toTokenElement);
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
  const withNewLines = insertNewlines(snippet);
  return splitAt(withNewLines.code.children,t => t.type === 'newline')
    .map(tokens => tokens.map(toTokenElement));
}

export function TokenElement({ token }: { token: Token }) {
  if (token.type === 'element') {
    return (
      <span className={token.properties.className.join(' ')}>
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