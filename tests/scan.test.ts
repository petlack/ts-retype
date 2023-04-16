import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { RetypeConfig } from '../src/config';
import { scan } from '../src/scan';

function writeSrc(path: string, src: string) {
  fs.writeFileSync(path, src);
}

describe('scan', () => {
  const dir = fs.mkdtempSync('ts-retype-scan');
  beforeEach(() => {
    writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
    writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
    writeSrc(path.join(dir, 'abc.ts'), 'export type O<T> = { abc: T[]; }');
    writeSrc(path.join(dir, 'xyz.ts'), 'export type X = { bar: number[]; }');
    writeSrc(path.join(dir, '012.ts'), 'export type X = { bar: number; }');
  });
  afterEach(() => {
    rimrafSync(dir);
  });
  it('finds duplicate files in different files', () => {
    const given = scan(RetypeConfig.fromScanProps({ rootDir: dir }));
    const expected = [
      {
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
        group: 'renamed',
        properties: [{ name: 'foo', type: 'string' }],
      },
    ];
    expect(given.data).toMatchObject(expected);

    expect(given.meta).toMatchObject({
      projectFilesScanned: 5,
      projectFilesWithTypesDeclarations: 5,
      projectLocScanned: 5,
    });
    expect(given.meta.projectName).toMatch(/ts-retype.*/);
    expect(given.meta.scanDuration).toBeGreaterThan(0);
    expect(given.meta.scannedAt).not.toBeNull();
  });
});
