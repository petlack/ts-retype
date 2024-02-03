import { expect, describe, test } from 'vitest';
import { compress, compressRoot, decompress, decompressRoot } from '../../src/snippet.js';
import { highlight } from '../../src/highlight.js';
import type { Token } from '../../src/types/index.js';

describe('compress', () => {
    test('newline', () => {
        const given: Token = {
            type: 'newline',
        };
        expect(compress(given)).toEqual({ t: 'n' });
    });

    test('text', () => {
        const given: Token = {
            type: 'text',
            value: 'foo',
        };
        expect(compress(given)).toEqual({ t: 't', v: 'foo' });
    });

    test('text with properties', () => {
        const given: Token = {
            type: 'text',
            value: 'foo',
            properties: { className: ['abc', 'xyz'] },
        };
        expect(compress(given)).toEqual({ t: 't', v: 'foo', p: { c: ['abc', 'xyz'] } });
    });

    test('empty element with properties', () => {
        const given: Token = {
            type: 'element',
            children: [],
            properties: { className: ['abc', 'xyz'] },
        };
        expect(compress(given)).toEqual({ t: 'e', p: { c: ['abc', 'xyz'] } });
    });

    test('empty element with tagName', () => {
        const given: Token = {
            type: 'element',
            children: [],
            tagName: 'span',
        };
        expect(compress(given)).toEqual({ t: 'e', n: 's' });
    });

    test('empty element with tagName and properties', () => {
        const given: Token = {
            type: 'element',
            children: [],
            tagName: 'span',
            properties: { className: ['foo', 'bar'] },
        };
        expect(compress(given)).toEqual({ t: 'e', n: 's', p: { c: ['foo', 'bar'] } });
    });

    test('element with one child', () => {
        const given: Token = {
            type: 'element',
            children: [{ type: 'newline' }],
        };
        expect(compress(given)).toEqual({ t: 'e', c: [{ t: 'n' }] });
    });

    test('element with many children', () => {
        const given: Token = {
            type: 'element',
            children: [{ type: 'newline' }, { type: 'text', value: 'foo' }],
        };
        expect(compress(given)).toEqual({ t: 'e', c: [{ t: 'n' }, { t: 't', v: 'foo' }] });
    });

    test('element with nested children', () => {
        const given: Token = {
            type: 'element',
            children: [
                { type: 'newline' },
                { type: 'text', value: 'foo' },
                { type: 'element', children: [{ type: 'newline' }] },
            ],
        };
        expect(compress(given)).toEqual({
            t: 'e',
            c: [{ t: 'n' }, { t: 't', v: 'foo' }, { t: 'e', c: [{ t: 'n' }] }],
        });
    });

    test('from source file', () => {
        const src = 'const foo = "bar";';
        const tokenRoot = highlight(src);
        const expected = [
            { v: 'const', t: 't', p: { c: ['t', 'k'] }, n: 's' },
            { v: ' foo ', t: 't' },
            { v: '=', t: 't', p: { c: ['t', 'o'] }, n: 's' },
            { v: ' ', t: 't' },
            { v: '"bar"', t: 't', p: { c: ['t', 's'] }, n: 's' },
            { v: ';', t: 't', p: { c: ['t', 'p'] }, n: 's' },
        ];
        const result = compressRoot(tokenRoot);
        expect(result).toEqual(expected);
    });
});

describe('decompress', () => {
    test('empty', () => {
        expect(decompress(null)).toEqual(undefined);
        expect(decompress({})).toEqual(undefined);
    });

    test('newline', () => {
        expect(decompress({ t: 'n' })).toEqual({ type: 'newline' });
    });

    test('text', () => {
        expect(decompress({ t: 't', v: 'v' })).toEqual({
            type: 'text',
            value: 'v',
        });
    });

    test('text with properties', () => {
        expect(decompress({ t: 't', v: 'v', p: { c: ['foo'] } })).toEqual({
            type: 'text',
            value: 'v',
            properties: { className: ['foo'] },
        });
    });

    test('from source file', () => {
        const src = 'const foo = "bar";';
        const tokenRoot = highlight(src);
        const compressed = compressRoot(tokenRoot);
        const decompressed = decompressRoot(compressed);
        expect(decompressed).toMatchObject(tokenRoot);
    });
});
