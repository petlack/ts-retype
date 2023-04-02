import { getTypesInFile } from '../src/clusters';
import {
  pairsToClusters,
  toSimilarityPairs,
  clustersToOutput,
  similarityMatrix,
} from '../src/similarity';
import { createFile } from '../src/utils';

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

  test('all renamed literal types', () => {
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
          { file: 'src.ts', lines: [1, 2], pos: [0, 42], type: 'literal' },
          { file: 'src.ts', lines: [2, 3], pos: [42, 84], type: 'literal' },
        ],
        group: 'renamed',
        names: [
          { name: 'A', count: 1 },
          { name: 'B', count: 1 },
        ],
        properties: [
          { name: 'foo', type: 'string' },
          { name: 'bar', type: 'string' },
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
          { file: 'src.ts', lines: [1, 2], pos: [0, 42], type: 'literal' },
          { file: 'src.ts', lines: [2, 3], pos: [42, 84], type: 'literal' },
          { file: 'src.ts', lines: [3, 4], pos: [84, 126], type: 'literal' },
        ],
        group: 'renamed',
        names: [
          { name: 'A', count: 1 },
          { name: 'B', count: 2 },
        ],
        properties: [
          { name: 'foo', type: 'string' },
          { name: 'bar', type: 'string' },
        ],
      },
      {
        files: [
          { file: 'src.ts', lines: [2, 3], pos: [42, 84], type: 'literal' },
          { file: 'src.ts', lines: [3, 4], pos: [84, 126], type: 'literal' },
        ],
        group: 'identical',
        names: [{ name: 'B', count: 2 }],
        properties: [
          { name: 'foo', type: 'string' },
          { name: 'bar', type: 'string' },
        ],
      },
    ]);
  });

  test('type & interface & anonymous literal', () => {
    const relPath = 'src.ts';
    const srcFile = createFile(`
    export type User = {
      displayName: string;
      email: string;
      password: string;
    };
    interface IUser {
      displayName: string;
      email: string;
      password: string;
    }
    async function saveUser(
      user: {
        displayName: string;
        email: string;
        password: string
      }) {
      await db.createUser(user);
    }
    `);
    const { types, lengths } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters, { [relPath]: lengths });
    expect(output).toEqual([
      {
        files: [
          { file: 'src.ts', lines: [1, 6], pos: [0, 104], type: 'literal' },
          { file: 'src.ts', lines: [6, 11], pos: [104, 204], type: 'interface' },
          { file: 'src.ts', lines: [13, 17], pos: [245, 332], type: 'literal' },
        ],
        group: 'renamed',
        names: [
          { name: 'User', count: 1 },
          { name: 'IUser', count: 1 },
          { name: 'anonymous', count: 1 },
        ],
        properties: [
          { name: 'displayName', type: 'string' },
          { name: 'email', type: 'string' },
          { name: 'password', type: 'string' },
        ],
      },
    ]);
  });
});
