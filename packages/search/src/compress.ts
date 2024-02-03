import { compressRoot } from './snippet.js';
import { TypeDuplicate } from './types.js';

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
