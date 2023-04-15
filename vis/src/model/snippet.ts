import { Token, TokenRoot } from '../../../src/types/snippet';

function containsPhrase(str: string, phrase: string): boolean {
  const regex = new RegExp(phrase, 'i');
  return regex.test(str);
}

export function highlightTokens(root: TokenRoot, phrase: string): TokenRoot {
  function highlight(token: Token): Token {
    if (token.type === 'text' && phrase.length && containsPhrase(token.value, phrase)) {
      return {
        ...token,
        properties: {
          className: [...(token.properties?.className || []), 'sat--found'],
        },
      };
    }
    if (token.type === 'element') {
      return {
        ...token,
        children: token.children.map(highlight),
      };
    }
    return token;
  }
  return {
    type: 'root',
    children: root.children.map(highlight),
  };
}
