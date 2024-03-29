import { describe, expect, test } from 'vitest';
import { getAllCandidates } from '../src/parse.js';
import { loadFile } from '../src/utils.js';

describe('stress test', () => {
    test('binderBinaryExpressionStressJs.ts', async () => {
        const srcFile = loadFile('./tests/sources/binderBinaryExpressionStressJs.fake_ts');
        const types = getAllCandidates(srcFile);
        expect(types).toHaveLength(0);
    });
});
