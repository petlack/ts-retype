import { describe, expect, beforeEach, afterEach, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { RetypeConfig } from '../src/config.js';
import { scan } from '../src/scan.js';

function writeSrc(path: string, src: string) {
    fs.writeFileSync(path, src);
}

describe('scan', () => {
    const dir = fs.mkdtempSync('ts-retype-scan');
    beforeEach(() => {
        writeSrc(path.join(dir, 'notypes.ts'), 'funcion foo() {}');
        writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
        writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
        writeSrc(path.join(dir, 'abc.ts'), 'export type O<T> = { abc: T[]; }');
        writeSrc(path.join(dir, 'xyz.ts'), 'export type X = { bar: number[]; }');
        writeSrc(path.join(dir, '012.ts'), 'export type X = { bar: number; }');
        writeSrc(
            path.join(dir, 'union-a.ts'),
            `export type b = {
  foo: string;
  code: 'ok' | 'fail';
}`,
        );
        writeSrc(
            path.join(dir, 'union-b.ts'),
            `export type b = {
  xyz: number
  status: 'ok' | 'fail';
}`,
        );
    });
    afterEach(() => {
        if (fs.existsSync(dir) && dir.includes('ts-retype-scan')) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });
    it('finds duplicate files in different files', () => {
        const given = scan(RetypeConfig.fromScanProps({ rootDir: dir }));
        const expected = [
            {
                group: 'identical',
                types: ['ok', 'fail'],
                names: [{ name: 'anonymous', count: 2 }],
                files: [
                    {
                        name: 'anonymous',
                        type: 'union',
                        pos: [42, 55],
                        offset: 24,
                        lines: [3, 3],
                        types: ['ok', 'fail'],
                        file: 'union-b.ts',
                    },
                    {
                        name: 'anonymous',
                        type: 'union',
                        pos: [41, 54],
                        offset: 23,
                        lines: [3, 3],
                        types: ['ok', 'fail'],
                        file: 'union-a.ts',
                    },
                ],
            },
            {
                group: 'renamed',
                properties: [{ name: 'foo', type: 'string' }],
                names: [
                    { name: 'A', count: 1 },
                    { name: 'b', count: 1 },
                ],
                files: [
                    {
                        file: 'foo.ts',
                        type: 'literal',
                        pos: [16, 32],
                        lines: [1, 1],
                        src: 'export type A = { foo: string; }',
                    },
                    {
                        file: 'bar.ts',
                        type: 'literal',
                        pos: [16, 32],
                        lines: [1, 1],
                        src: 'export type b = { foo: string; }',
                    },
                ],
            },
        ];
        expect(given.data).toMatchObject(expected);

        expect(given.meta).toMatchObject({
            projectFilesScanned: 8,
            projectFilesWithTypesDeclarations: 7,
            projectLocScanned: 14,
        });
        expect(given.meta.projectName).toMatch(/ts-retype.*/);
        // expect(given.meta.scanDuration).toBeGreaterThan(0);
        expect(given.meta.scannedAt).not.toBeNull();
    });
});
