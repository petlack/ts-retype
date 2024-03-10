import { describe, expect, it } from 'vitest';
import { clsx } from './clsx.js';

describe('empty', () => {
    it('should return empty string', () => {
        expect(clsx()).toEqual('');
    });
});

describe('string', () => {
    it('should return the string', () => {
        expect(clsx('foo')).toEqual('foo');
    });
});

describe('multiple strings', () => {
    it('should return concatenated strings', () => {
        expect(clsx('foo', 'bar')).toEqual('foo bar');
    });
});

describe('array of strings', () => {
    it('should return concatenated strings', () => {
        expect(clsx(['foo', 'bar'])).toEqual('foo bar');
    });
});

describe('mixed multiple strings & array of strings', () => {
    it('should return concatenated strings', () => {
        expect(clsx('foo', 'bar', ['foo', 'bar'])).toEqual('foo bar foo bar');
    });
});

describe('object', () => {
    it('should return concatenated keys with truthy values', () => {
        expect(clsx({
            foo: true,
            xyz: false,
            bar: 1,
            abc: 0,
        })).toEqual('foo bar');
    });
});

describe('mixed', () => {
    it('should return keys with truthy values', () => {
        expect(clsx(
            'aaa',
            {
                foo: true,
                xyz: false,
                bar: 1,
                abc: 0,
            },
            ['bbb', 'ccc']
        )).toEqual('aaa foo bar bbb ccc');
    });
});
