import { expect, describe, test } from 'vitest';
import { findTypesInFile } from '../../src/clusters.js';
import { createFile } from '../../src/utils.js';

describe('offsets', () => {
    test('in the middle of the file', () => {
        const src = `// ...
// ...
export type User = {
  name: string;
  password: string;
}
// ...
// ...
// ...`;
        const srcFile = createFile(src);
        const candidates = findTypesInFile(srcFile, '.');

        expect(candidates.types[0]).toHaveProperty('offset', 26);
    });

    test('export type on first line', () => {
        const src = `export type ScanProps = {
  exclude: string[];
  include: string[];
  rootDir: string;
};`;
        const srcFile = createFile(src);
        const candidates = findTypesInFile(srcFile, '.');

        expect(candidates.types[0]).toHaveProperty('offset', 24);
    });
    test('export type inside the file', () => {
        const src = `// ...
// ...
// ...
// ...
// ...
// ...
export type User = {
  displayName: string;
  email: string;
  password: string;
};
// ...
// ...`;
        const srcFile = createFile(src);
        const candidates = findTypesInFile(srcFile, '.');

        expect(candidates.types[0]).toHaveProperty('offset', 26);
    });
    test('type after import', () => {
        const src = `import { TokenRoot } from './snippet';

export type TypeDuplicate = {
  files: {
    name: string;
    file: string;
  }
};`;
        const srcFile = createFile(src);
        const candidates = findTypesInFile(srcFile, '.');

        expect(candidates.types[0]).toHaveProperty('offset', 29);
    });

    test('type on first line', () => {
        const src = `type A = {
  message: string
  status: { code: number, title: string };
}`;
        const srcFile = createFile(src);
        const candidates = findTypesInFile(srcFile, '.');

        expect(candidates.types[0]).toHaveProperty('offset', 9);
    });
});
