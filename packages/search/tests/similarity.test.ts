import { describe, expect, test } from 'vitest';
import { clustersToDuplicates, findTypesInFile } from '../src/clusters.js';
import { similarityMatrixToClusters, computeSimilarityMatrix } from '../src/similarity.js';
import { createFile } from '../src/utils.js';
import { Clusters, SparseMatrix } from '../src/types/similarity.js';

describe('SparseMatrix', () => {
    test('get/set', () => {
        const matrix = SparseMatrix({ nil: -1 }).set(10, 12, 1);
        expect(matrix.get(10, 12)).toBe(1);
        expect(matrix.get(0, 0)).toBe(-1);
        expect(matrix.get(10, 0)).toBe(-1);
        expect(matrix.get(0, 12)).toBe(-1);
    });
    test('keys', () => {
        const matrix = SparseMatrix({ nil: -1 }).set(100, 12, 1).set(10, 12, 2);
        expect(matrix.keys().sort()).toEqual([10, 12, 100].sort());
    });
    test('toDense', () => {
        const matrix = SparseMatrix({ nil: 0 }).set(1, 2, 1).set(0, 0, 2);
        expect(matrix.keys().sort()).toEqual([0, 1, 2].sort());
        expect(matrix.toDense()).toEqual([
            [2, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
        ]);
    });
    test('fromDense', () => {
        expect(
            SparseMatrix({ nil: 0 })
                .fromDense([
                    [1, 2],
                    [2, 1],
                ])
                .toDense(),
        ).toEqual([
            [1, 2],
            [2, 1],
        ]);
    });
});

describe('Clusters', () => {
    test('addTuple & findCluster', () => {
        const clusters = Clusters<number>();
        expect(clusters.findCluster(0, 0, 0)).toBeFalsy();

        clusters.addTuple(0, 0, 1);
        expect(clusters.findCluster(0, 0, 0)).toBeFalsy();
        expect(clusters.findCluster(0, 0, 1)).toEqual(new Set([0]));

        clusters.addTuple(0, 1, 1);
        expect(clusters.findCluster(0, 0, 1)).toEqual(new Set([0, 1]));

        clusters.addTuple(1, 3, 1);
        expect(clusters.findCluster(1, 2, 1)).toEqual(new Set([0, 1, 3]));
    });
    test('flatMap', () => {
        const clusters = Clusters<number>().fromTuples([
            [0, 0, 1],
            [0, 1, 1],
            [5, 8, 1],
            [8, 9, 1],
            [1, 3, 1],
            [3, 5, 2],
        ]);
        expect(clusters.flatMap((val, idxs) => ({ val, idxs }))).toEqual([
            { val: 1, idxs: new Set([0, 1, 3]) },
            { val: 1, idxs: new Set([5, 8, 9]) },
            { val: 2, idxs: new Set([3, 5]) },
        ]);
    });
});

describe('similarityMatrixToClusters', () => {
    test('returns clusters', () => {
        const given = similarityMatrixToClusters(
            SparseMatrix({ nil: 0 }).fromDense([
                [4, 0, 1, 3],
                [0, 4, 3, 3],
                [1, 3, 4, 2],
                [3, 3, 2, 4],
            ]),
        ).flatMap((val, idxs) => ({ val, idxs }));
        expect(given).toEqual([
            { val: 1, idxs: new Set([0, 2]) },
            { val: 3, idxs: new Set([0, 3, 1]) },
            { val: 3, idxs: new Set([1, 2]) },
            { val: 2, idxs: new Set([2, 3]) },
        ]);
    });
});

describe('clustersToOutput', () => {
    test('no candidate types returns empty array', () => {
        const relPath = 'src.ts';
        const srcFile = createFile('type A = { foo: string; bar: string }');
        const { types } = findTypesInFile(srcFile, relPath);
        const matrix = computeSimilarityMatrix(types);
        const clusters = similarityMatrixToClusters(matrix);
        const output = clustersToDuplicates(types, clusters);
        expect(output).toEqual([]);
    });

    test('all renamed literal types', () => {
        const relPath = 'src.ts';
        const srcFile = createFile(`
    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `);
        const expectedSrcA = `
    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `;
        const expectedSrcB = `    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `;
        const { types } = findTypesInFile(srcFile, relPath);
        const matrix = computeSimilarityMatrix(types);
        const clusters = similarityMatrixToClusters(matrix);
        const output = clustersToDuplicates(types, clusters);
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
        const expectedSrcA = `
    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }`;
        const expectedSrcB = `    type A = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `;
        const expectedSrcC = `    type B = { foo: string; bar: string }
    type B = { foo: string; bar: string }
    `;
        const { types } = findTypesInFile(srcFile, relPath);
        const matrix = computeSimilarityMatrix(types);
        const clusters = similarityMatrixToClusters(matrix);
        const output = clustersToDuplicates(types, clusters);
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
        const { types } = findTypesInFile(srcFile, relPath);
        const matrix = computeSimilarityMatrix(types);
        const clusters = similarityMatrixToClusters(matrix);
        const output = clustersToDuplicates(types, clusters);
        expect(output).toMatchObject([
            {
                files: [
                    {
                        file: 'src.ts',
                        lines: [2, 6],
                        pos: [24, 103],
                        type: 'literal',
                        src: `
    export type User = {
      displayName: string;
      email: string;
      password: string;
    };
`,
                    },
                    {
                        file: 'src.ts',
                        lines: [8, 12],
                        pos: [110, 205],
                        type: 'interface',
                        src: `
    interface IUser {
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
