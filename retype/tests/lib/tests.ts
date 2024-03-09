import { Similarity } from '../../src/types/similarity';

export function expectSimilarity(given: Similarity, expected: Similarity) {
  expect(Similarity[given]).toEqual(Similarity[expected]);
}
