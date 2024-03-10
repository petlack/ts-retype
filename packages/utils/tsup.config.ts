import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/core.ts',
        'src/std.ts',
        'src/test.ts',
        'src/tree.ts',
    ],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    shims: true,
});
