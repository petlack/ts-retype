import { describe, expect, it } from 'vitest';
import { formatJson } from './core.js';

describe('formatJson', () => {
    it('formats simple objects', () => {
        expect(formatJson({})).toEqual('{}');
        expect(formatJson({ foo: 'bar' })).toEqual('{ "foo": "bar" }');
    });
});
