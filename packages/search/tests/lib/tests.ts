import { expect } from 'vitest';
import { Similarity } from '../../src/types/similarity.js';

export function expectSimilarity(given: Similarity, expected: Similarity) {
    expect(Similarity[given]).toEqual(Similarity[expected]);
}
