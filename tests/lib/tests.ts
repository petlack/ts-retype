import { Similarity } from '../../src/types';

export function expectSimilarity(given: Similarity, expected: Similarity) {
  expect(Similarity[given]).toEqual(Similarity[expected]);
}
