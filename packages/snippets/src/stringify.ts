import { all, map, pipe, repeat } from 'ramda';

type JsonKey = string | number;
type JsonValue = string | number | boolean | null | undefined;
type JsonArray = Json[];
type JsonObject = { [k: JsonKey]: Json };
export type Json = JsonValue | JsonValue[] | JsonObject | JsonArray;

export function isValue(json: Json): json is JsonValue {
    return json == null || ['string', 'number', 'boolean'].includes(typeof json);
}

export function isObject(json: Json): json is JsonObject {
    return typeof json === 'object' && json != null;
}

export function isArray(json: Json): json is Json[] {
    return Array.isArray(json);
}

export function isShort(json: Json): boolean {
    if (isValue(json)) {
        return true;
    }
    const isShortArray = isArray(json) && all(isValue, json);
    const isArrayWithShortValues =
    isArray(json) &&
    pipe(
        map((v) => JSON.stringify(v)),
        map((s) => s.length),
        all((l) => l < 20),
    )(json);
    const isSmallArray = isArray(json) && json.length < 3;
    const isShortObject = isObject(json) && all(isValue, Object.values(json));
    const isObjectWithShortValues =
    isObject(json) &&
    pipe(
        Object.values,
        map((v) => JSON.stringify(v)),
        map((s) => s.length),
        all((l) => l < 20),
    )(json);
    const isSmallObject = isObject(json) && Object.keys(json).length < 3;
    return (
        isShortArray ||
    isShortObject ||
    (isObjectWithShortValues && isSmallObject) ||
    (isArrayWithShortValues && isSmallArray)
    );
}

export type StringifyOptions = {
  indent?: number;
  maxLength?: number;
  replacer?: <T>(key: string, value: T) => T;
};

function indent(level: number, char: string, single: number) {
    return repeat(char, level * single).join('');
}

export function stringifyNice<T extends Json>(obj: T, level = 0): string {
    const currentIndent = indent(level, ' ', 2);
    const nextIndent = indent(level + 1, ' ', 2);

    if (obj === undefined) {
        return JSON.stringify(null);
    }

    if (isValue(obj)) {
        return JSON.stringify(obj).replace(/'/g, '\\\'').replace(/"/g, '\'');
    }

    if (isArray(obj)) {
        if (isShort(obj)) {
            return `[${obj.map(stringifyNice).join(', ')}]`;
        }
        return [
            '[',
            obj.map((item: Json) => `${nextIndent}${stringifyNice(item, level + 1)}`).join(',\n'),
            `${currentIndent}]`,
        ].join('\n');
    }

    if (isObject(obj)) {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '{}';
        }
        if (isShort(obj)) {
            const kvs = keys.map((key) => `${key}: ${stringifyNice(obj[key], 0)}`);
            return `{ ${kvs.join(', ')} }`;
        }
        const kvs = keys.map((key) => `${key}: ${stringifyNice(obj[key], level + 1)}`);
        return ['{', kvs.map((kv) => `${nextIndent}${kv}`).join(',\n'), `${currentIndent}}`].join('\n');
    }

    return JSON.stringify(obj);
}
