import { compressRoot } from './snippet';
import { TypeDuplicate } from './types';

export function compress(tds: TypeDuplicate[]): TypeDuplicate[] {
  return tds.map((td) => ({
    ...td,
    files: td.files.map((file) => ({
      ...file,
      src: '',
      srcHgl: file.srcHgl ? compressRoot(file.srcHgl) : undefined,
    })),
  }));
}
