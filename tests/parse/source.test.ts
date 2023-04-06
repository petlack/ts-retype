import { getTypesInFile } from '../../src/clusters';
import { createFile } from '../../src/utils';

describe('parse', () => {
  test('simple type', () => {
    const src = `export function zip(
      left: number[],
      right: Iterable<number>,
    ): string {
      return left.map((_, idx) => [left[idx], right[idx]]);
    }`;
    const srcFile = createFile(src);
    const candidates = getTypesInFile(srcFile, '.');

    expect(candidates.types[0]).toMatchObject({ src: '(number[], Iterable<number>) => string' });
  });
});
