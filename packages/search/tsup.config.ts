import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/snippet.ts',
        'src/highlight.ts',
        'src/types.ts',
    ],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
