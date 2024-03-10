import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/bin.ts',
    ],
    format: ['cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    noExternal: [ /(.*)/ ],
});
