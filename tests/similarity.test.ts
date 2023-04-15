import { clustersToOutput, getTypesInFile } from '../src/clusters';
import { pairsToClusters, toSimilarityPairs, similarityMatrix } from '../src/similarity';
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
    const { types } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters);
    expect(output).toEqual([]);
  });

  test('all renamed literal types', () => {
    const relPath = 'src.ts';
    const srcFile = createFile(`
    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `);
    const expectedSrc = `    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }`;
    const { types } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters);
    expect(output).toMatchObject([
      {
        files: [
          {
            file: 'src.ts',
            lines: [2, 2],
            pos: [14, 42],
            type: 'literal',
            src: expectedSrc,
          },
          {
            file: 'src.ts',
            lines: [3, 3],
            pos: [56, 84],
            type: 'literal',
            src: expectedSrc,
          },
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
    const expectedSrcA = `    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }`;
    const expectedSrcB = `    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }`;
    const expectedSrcC = `    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }`;
    const { types } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters);
    expect(output).toMatchObject([
      {
        files: [
          {
            file: 'src.ts',
            lines: [2, 2],
            pos: [14, 42],
            type: 'literal',
            src: expectedSrcA,
          },
          {
            file: 'src.ts',
            lines: [3, 3],
            pos: [56, 84],
            type: 'literal',
            src: expectedSrcB,
          },
          {
            file: 'src.ts',
            lines: [4, 4],
            pos: [98, 126],
            type: 'literal',
            src: expectedSrcC,
          },
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
          {
            file: 'src.ts',
            lines: [3, 3],
            pos: [56, 84],
            type: 'literal',
            src: expectedSrcB,
          },
          {
            file: 'src.ts',
            lines: [4, 4],
            pos: [98, 126],
            type: 'literal',
            src: expectedSrcC,
          },
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
    const { types } = getTypesInFile(srcFile, relPath);
    const matrix = similarityMatrix(types);
    const pairs = toSimilarityPairs(matrix);
    const clusters = pairsToClusters(pairs);
    const output = clustersToOutput(types, clusters);
    expect(output).toMatchObject([
      {
        files: [
          {
            file: 'src.ts',
            lines: [2, 6],
            pos: [24, 103],
            type: 'literal',
            src: `    export type User = {
      displayName: string;
      email: string;
      password: string;
    };`,
          },
          {
            file: 'src.ts',
            lines: [8, 12],
            pos: [110, 205],
            type: 'interface',
            src: `    interface IUser {
      displayName: string;
      email: string;
      password: string;
    }

    async function saveUser(`,
          },
          {
            file: 'src.ts',
            lines: [15, 19],
            pos: [248, 334],
            type: 'literal',
            src: `    async function saveUser(
      user: {
        displayName: string;
        email: string;
        password: string
      }) {
        await db.createUser(user);`,
          },
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
