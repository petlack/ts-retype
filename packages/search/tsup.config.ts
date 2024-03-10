import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/types.ts',
    ],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    noExternal: [
        '@ts-retype/utils',
        '@ts-retype/syhi',
    ],
});
