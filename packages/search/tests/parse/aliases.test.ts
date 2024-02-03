import { expect, describe, it } from 'vitest';
import { removeAliasDuplicates } from '../../src/parse.js';

describe('aliases', () => {
    it('does not remove anything if there is no alias', () => {
        expect(
            removeAliasDuplicates([
                { name: 'anonymous', src: '', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
            ]),
        ).toEqual([
            { name: 'anonymous', src: '', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
        ]);
    });

    it('removes types ending at the same position', () => {
        expect(
            removeAliasDuplicates([
                { name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
                { name: 'anonymous', src: '', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
            ]),
        ).toEqual([{ name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' }]);
    });

    it('does not remove nested type', () => {
        expect(
            removeAliasDuplicates([
                { name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
                { name: 'anonymous', src: '', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
                { name: 'anonymous', src: '', offset: 0, pos: [3, 6], lines: [1, 1], type: 'literal' },
            ]),
        ).toEqual([
            { name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' },
            { name: 'anonymous', src: '', offset: 0, pos: [3, 6], lines: [1, 1], type: 'literal' },
        ]);
    });

    it('removes type at different ending', () => {
        expect(
            removeAliasDuplicates([
                { name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
                { name: 'anonymous', src: '', offset: 0, pos: [1, 9], lines: [1, 1], type: 'interface' },
            ]),
        ).toEqual([{ name: 'a', src: '', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' }]);
    });
});
