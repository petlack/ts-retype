import { describe, expect, test } from 'vitest';
import { getAllCandidates } from '../src/parse.js';
import { loadFile } from '../src/utils.js';

describe.only('stress test', () => {
    test('binderBinaryExpressionStressJs.ts', async () => {
        const srcFile = loadFile('./tests/sources/binderBinaryExpressionStressJs.ts');
        const types = getAllCandidates(srcFile);
        expect(types).toHaveLength(0);
    });
});
