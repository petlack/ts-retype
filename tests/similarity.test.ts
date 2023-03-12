import { getTypesInFile } from '../src/clusters';
import {
  similarity,
  pairsToClusters,
  toSimilarityPairs,
  clustersToOutput,
  similarityMatrix,
} from '../src/similarity';
import { LiteralCandidateType, Similarity } from '../src/types';
import { createFile } from '../src/utils';

function expectSimilarity(given: Similarity, expected: Similarity) {
  expect(Similarity[given]).toEqual(Similarity[expected]);
}

describe('similarity', () => {
  test('identical types with no properties', () => {
    const given = similarity(
      <LiteralCandidateType>{ name: 'foo', type: 'literal', properties: [], pos: [0, 0] },
      <LiteralCandidateType>{ name: 'foo', type: 'literal', properties: [], pos: [0, 0] },
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('identical types with primitive properties', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralCandidateType>{
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
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralCandidateType>{
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
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [{ key: 'bar', type: 'StringKeyword', value: 'string' }],
      },
      <LiteralCandidateType>{
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
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        pos: [0, 0],
        properties: [
          { key: 'bar', type: 'StringKeyword', value: 'string' },
          { key: 'xyz', type: 'StringKeyword', value: 'number' },
        ],
      },
      <LiteralCandidateType>{
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
      <LiteralCandidateType>{ name: 'foo', type: 'literal', pos: [0, 0], properties: [] },
      <LiteralCandidateType>{ name: 'bar', type: 'literal', pos: [0, 0], properties: [] },
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});

describe('toSimilarityPairs', () => {
  test('ok', () => {
    const given = toSimilarityPairs([
      [4, 0, 2, 1],
      [0, 4, 2, 2],
      [2, 2, 4, 0],
      [1, 0, 0, 4],
    ]);
    expect(given).toEqual([
      [0, 2, 2],
      [0, 3, 1],
      [1, 2, 2],
      [1, 3, 2],
    ]);
  });
});

describe('pairsToClusters', () => {
  test('ok', () => {
    const given = pairsToClusters([
      [0, 1, 9],
      [1, 2, 9],
      [3, 4, 8],
    ]);
    expect(given).toEqual({ 9: [new Set([0, 1, 2])], 8: [new Set([3, 4])] });
  });
});

describe('clustersToOutput', () => {
  test('no candidate types returns empty array', () => {
    const relPath = 'src.ts';
    const srcFile = createFile('type A = { foo: string; bar: string }');
    const { types, lengths } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters, { [relPath]: lengths });
    expect(output).toEqual([]);
  });
  describe('literal types', () => {
    test('all renamed', () => {
      const relPath = 'src.ts';
      const srcFile = createFile(`
      type A = { foo: string; bar: string }
      type B = { foo: string; bar: string }
      `);
      const { types, lengths } = getTypesInFile(srcFile, relPath);
      const matrix = similarityMatrix(types);
      const pairs = toSimilarityPairs(matrix);
      const clusters = pairsToClusters(pairs);
      const output = clustersToOutput(types, clusters, { [relPath]: lengths });
      expect(output).toEqual([
        {
          files: [
            { file: 'src.ts', lines: [1, 2], pos: [0, 44], type: 'alias' },
            { file: 'src.ts', lines: [2, 3], pos: [44, 88], type: 'alias' },
          ],
          group: 'HasIdenticalProperties',
          name: 'A',
          names: { A: 1, B: 1 },
          type: 'alias',
          properties: [
            { key: 'foo', value: 'string', type: 'StringKeyword' },
            { key: 'bar', value: 'string', type: 'StringKeyword' },
          ],
        },
      ]);
    });
    test('renamed & identical groups', () => {
      const relPath = 'src.ts';
      const srcFile = createFile(`
      type A = { foo: string; bar: string }
      type B = { foo: string; bar: string }
      type B = { foo: string; bar: string }
      `);
      const { types, lengths } = getTypesInFile(srcFile, relPath);
      const matrix = similarityMatrix(types);
      const pairs = toSimilarityPairs(matrix);
      const clusters = pairsToClusters(pairs);
      const output = clustersToOutput(types, clusters, { [relPath]: lengths });
      expect(output).toEqual([
        {
          files: [
            { file: 'src.ts', lines: [1, 2], pos: [0, 44], type: 'alias' },
            { file: 'src.ts', lines: [2, 3], pos: [44, 88], type: 'alias' },
            { file: 'src.ts', lines: [3, 4], pos: [88, 132], type: 'alias' },
          ],
          group: 'HasIdenticalProperties',
          name: 'A',
          names: { A: 1, B: 2 },
          type: 'alias',
          properties: [
            { key: 'foo', value: 'string', type: 'StringKeyword' },
            { key: 'bar', value: 'string', type: 'StringKeyword' },
          ],
        },
        {
          files: [
            { file: 'src.ts', lines: [2, 3], pos: [44, 88], type: 'alias' },
            { file: 'src.ts', lines: [3, 4], pos: [88, 132], type: 'alias' },
          ],
          group: 'Identical',
          name: 'B',
          names: { B: 2 },
          type: 'alias',
          properties: [
            { key: 'foo', value: 'string', type: 'StringKeyword' },
            { key: 'bar', value: 'string', type: 'StringKeyword' },
          ],
        },
      ]);
    });
  });
});
