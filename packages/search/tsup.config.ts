import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/compress.ts',
        'src/config.ts',
        'src/index.ts',
        'src/log.ts',
        'src/snippet.ts',
        'src/types.ts',
        'src/utils.ts',
    ],
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
