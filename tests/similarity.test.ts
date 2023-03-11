import { similarity, pairsToClusters } from '../src/similarity';
import { LiteralType, Similarity } from '../src/types';

function expectSimilarity(given: Similarity, expected: Similarity) {
  expect(Similarity[given]).toEqual(Similarity[expected]);
}

describe('similarity', () => {
  test('identical types with no properties', () => {
    const given = similarity(
      <LiteralType>{ name: 'foo', type: 'literal', properties: [], pos: [0, 0] },
      <LiteralType>{ name: 'foo', type: 'literal', properties: [], pos: [0, 0] },
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('identical types with primitive properties', () => {
    const given = similarity(
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('types with different properties keys', () => {
    const given = similarity(
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'xyz', type: 'StringKeyword', value: 'string' }],
      },
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('types with different properties values', () => {
    const given = similarity(
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'NumberKeyword', value: 'number' }],
      },
    );
    expectSimilarity(given, Similarity.HasSimilarProperties);
  });
  test('types with subset of properties', () => {
    const given = similarity(
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [
          { key: 'bar', type: 'StringKeyword', value: 'string' },
          { key: 'xyz', type: 'StringKeyword', value: 'number' },
        ],
      },
      <LiteralType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'NumberKeyword', value: 'string' }],
      },
    );
    expectSimilarity(given, Similarity.HasSubsetOfProperties);
  });
  test('identical types with no properties and different names', () => {
    const given = similarity(
      <LiteralType>{ name: 'foo', type: 'literal', pos: [0, 0], properties: [] },
      <LiteralType>{ name: 'bar', type: 'literal', pos: [0, 0], properties: [] },
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});

describe('toClusters', () => {
  test('ok', () => {
    const given = pairsToClusters([
      [0, 1],
      [1, 2],
      [3, 4],
    ]);
    expect(given).toEqual([new Set([0, 1, 2]), new Set([3, 4])]);
  });
});
