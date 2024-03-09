import { findTypesInFile } from '../../src/clusters';
import { createFile } from '../../src/utils';

describe('parse', () => {
  test('function should return signature', () => {
    const src = `export function zip(
      left: number[],
      right: Iterable<number>,
    ): string {
      return left.map((_, idx) => [left[idx], right[idx]]);
    }`;
    const srcFile = createFile(src);
    const candidates = findTypesInFile(srcFile, '.');

    expect(candidates.types[0]).toMatchObject({
      src: `zip(
  left: number[],
  right: Iterable<number>
) => 
  string`,
    });
  });

  test('indentation', () => {
    const src = `type A = {
      foo: string;
                  bar: number;
    }`;
    const srcFile = createFile(src);
    const candidates = findTypesInFile(srcFile, '.');

    const expected = `type A = {
      foo: string;
                  bar: number;
    }`;
    expect(candidates.types[0].src).toEqual(expected);
  });
});
