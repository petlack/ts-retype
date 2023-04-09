import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { RetypeConfig } from '../src/config';
import { scan } from '../src/scan';

function writeSrc(path: string, src: string) {
  fs.writeFileSync(path, src);
}

describe('clusters', () => {
  const dir = fs.mkdtempSync('ts-retype-scan');
  beforeEach(() => {
    writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
    writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
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
      projectFilesScanned: 2,
      projectFilesWithTypesDeclarations: 2,
      projectLocScanned: 2,
    });
    expect(given.meta.projectName).toMatch(/ts-retype.*/);
    expect(given.meta.scanDuration).toBeGreaterThan(0);
    expect(given.meta.scannedAt).not.toBeNull();
  });
});
