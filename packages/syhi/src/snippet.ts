import type { Snippet, Token, TokenRoot, TokenText } from './types.js';

const classNamesMap = new Map<string, string>(
    [
        ['t', 'token'],
        ['p', 'punctuation'],
        ['f', 'function'],
        ['o', 'operator'],
        ['b', 'builtin'],
        ['c', 'class-name'],
        ['x', 'comment'],
        ['C', 'constant'],
        ['g', 'generic'],
        ['k', 'keyword'],
        ['s', 'string'],
    ]
        .map(
            ([s, l]) =>
        [
            [s, l],
            [l, s],
        ] as [string, string][],
        )
        .reduce((res, item) => [...res, ...item], []),
);

function filterFalsy<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => (typeof v === 'string' && v) || v),
    ) as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compressProperties(properties: NonNullable<Token['properties']>): any {
    return Object.fromEntries(Object.entries(properties).map(([k, v]) => [k[0], decodeClassName(v)]));
}

export function compress(token: Token): {
    t: string;
    v?: string;
    n?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    c?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p?: any;
} {
    switch (token.type) {
    case 'element':
        return {
            t: token.type[0],
            ...filterFalsy({
                c: token.children.length ? token.children.map(compress) : undefined,
                p: token.properties ? compressProperties(token.properties) : undefined,
                n: token.tagName === 'span' ? 's' : token.tagName,
            }),
        };
    case 'newline':
        return { t: 'n' };
    case 'text':
        return {
            v: token.value,
            t: token.type[0],
            ...filterFalsy({
                c: token.children && token.children?.length ? token.children.map(compress) : undefined,
                p: token.properties ? compressProperties(token.properties) : undefined,
                n: token.tagName === 'span' ? 's' : token.tagName,
            }),
        };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compressRoot({ children }: TokenRoot): any {
    return children.map(compress);
}

function decodeClassName(compressed: string[]): string[] {
    return compressed.map((c) => classNamesMap.get(c) || c);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decompressProperties(properties: any): Token['properties'] | undefined {
    if (!properties) {
        return undefined;
    }
    if (properties.c) {
        return filterFalsy({ className: decodeClassName(properties.c) });
    }
    return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decompress(compressed: any): Token | undefined {
    if (compressed == null) {
        return undefined;
    }
    switch (compressed.t) {
    case 'n':
        return { type: 'newline' };
    case 't':
        return filterFalsy({
            type: 'text',
            value: compressed.v || '',
            children: compressed.c?.map(decompress),
            properties: decompressProperties(compressed.p),
            tagName: compressed.n === 's' ? 'span' : compressed.n,
        }) as Token;
    case 'e':
        return filterFalsy({
            type: 'element',
            properties: decompressProperties(compressed.p),
            tagName: compressed.n === 's' ? 'span' : compressed.n,
            children: compressed.c?.map(decompress),
        }) as Token;
    }
    return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decompressRoot(compressed: any[]): TokenRoot | undefined {
    if (!compressed) {
        return undefined;
    }
    return {
        type: 'root',
        children: compressed.map(decompress) as Token[],
    };
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
    return splitAt(withNewLines.children || [], (t) => t.type === 'newline');
}

export function splitLines(root: TokenRoot): TokenRoot {
    const withNewLines = insertNewlines(root);
    const lines = splitAt(withNewLines.children || [], (t) => t.type === 'newline');
    return {
        type: 'root',
        children: lines.map((tokens) => ({ type: 'element', children: tokens } as Token)),
    };
}

export function flattenTokens(root: TokenRoot): TokenRoot {
    function flatten(token: Token): Token[] {
        if (token.type === 'element') {
            return token.children.reduce(
                (res, item) => [
                    ...res,
                    ...flatten(filterFalsy({ ...token, children: undefined, ...item } as Token)),
                ],
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

function fixNewlines(token: Token): Token {
    if (token.type === 'text') {
        return { ...token, value: token.value.replace('\r\n', '\n') };
    }
    return token;
}

function splitNewlines(token: Token): Token[] {
    if (token.type === 'text') {
        return token.value
            .split('\n')
            .flatMap(value => [{ ...token, value }, { type: 'newline' }] as Token[])
            .slice(0, -1);
    }
    return [token];
}

function stripNewlines(token: Token): Token {
    if (token.type === 'text') {
        return {
            ...token,
            value: token.value
                .replace(/^(\n)+/g, '')
                .replace(/(\n)+$/g, '')
        };
    }
    return token;
}

function startsWithNewline(token: Token): token is TokenText {
    return token.type === 'text' && token.value.startsWith('\n');
}

function endsWithNewline(token: Token): token is TokenText {
    return token.type === 'text' && token.value.endsWith('\n');
}

export function insertNewlines(root: TokenRoot): TokenRoot {
    const newline: Token = { type: 'newline' };
    const withNewLines = root.children.reduce(
        (res, item) => {
            const token = fixNewlines(item);
            const hasLeadingNewline = startsWithNewline(token);
            const hasTrailingNewline = endsWithNewline(token);
            return res.concat(
                hasLeadingNewline ? [newline] : [],
                splitNewlines(stripNewlines(token)),
                hasTrailingNewline ? [newline] : [],
            );
        },
        [] as Token[],
    );

    const code: TokenRoot = {
        type: 'root',
        children: withNewLines || [],
    };
    return code;
}

function isNotEmpty(token: Token) {
    const hasEmptyChildren = !token.children || !token.children.length;
    const hasEmptyProperties =
    !token.properties || !Object.keys(filterFalsy(token.properties)).length;
    const hasEmptyValue = !token.value;
    const hasEmptyTagName = !token.tagName;
    const hasAllEmpty = hasEmptyChildren && hasEmptyProperties && hasEmptyTagName && hasEmptyValue;
    switch (token.type) {
    case 'element':
        return !hasAllEmpty;
    case 'newline':
        return true;
    case 'text':
        return !hasAllEmpty;
    }
}

export function filterEmpty(root: TokenRoot): TokenRoot {
    return {
        ...root,
        children: root.children.filter(isNotEmpty),
    };
}
