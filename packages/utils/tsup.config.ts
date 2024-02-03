import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/log.ts',
        'src/utils.ts',
    ],
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
