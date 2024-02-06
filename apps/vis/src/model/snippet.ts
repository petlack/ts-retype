import type { Token, TokenRoot, TypeDuplicate } from '@ts-retype/search/types';

export const SAT_FOUND = 'bg-green-400';
export const SAT_DEF = 'bg-snippet-highlighted';

function containsPhrase(str: string, phrase: string): boolean {
    const regex = new RegExp(phrase, 'i');
    return regex.test(str);
}

export function highlightPhrase(root: TokenRoot, phrase: string): TokenRoot {
    function highlight(token: Token): Token {
        if (token.type === 'text' && phrase.length && containsPhrase(token.value, phrase)) {
            return {
                ...token,
                properties: {
                    className: [...(token.properties?.className || []), SAT_FOUND],
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

function tokenLength(token: Token): number {
    if (token.type === 'text') {
        return token.value.length;
    } else if (token.type === 'newline') {
        return 1;
    }
    return token.children.map(tokenLength).reduce((a, b) => a + b) + token.children.length - 1;
}

export function highlightDefinition(
    root: TokenRoot,
    { pos, offset }: Pick<TypeDuplicate['files'][0], 'offset' | 'pos'>,
): TokenRoot {
    let position = 0;
    const highlighted = [] as Token[];
    for (const token of root.children) {
        const newToken: Token = { ...token };
        if (position >= offset && position < offset + (pos[1] - pos[0])) {
            newToken.properties = {
                ...(token.properties || {}),
                className: [...(token.properties?.className || []), SAT_DEF],
            };
        }
        position += tokenLength(token);
        highlighted.push(newToken);
    }
    return {
        type: 'root',
        children: highlighted,
    };
}
