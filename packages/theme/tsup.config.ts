import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/bin.ts',
    ],
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
