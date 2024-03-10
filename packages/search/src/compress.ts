import { compressRoot } from '@ts-retype/syhi/snippet';
import type { TypeDuplicate } from './types.js';

/**
* Compresses the given duplicates by removing the source code and
* compressing the highlighted source code
*/
export function compress(
    tds: TypeDuplicate[],
): TypeDuplicate[] {
    return tds.map((td) => ({
        ...td,
        files: td.files.map((file) => ({
            ...file,
            src: '',
            srcHgl: file.srcHgl ? compressRoot(file.srcHgl) : undefined,
        })),
    }));
}
