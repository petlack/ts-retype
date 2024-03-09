import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/generate-readme.ts',
        'src/generate-cmd-help.ts',
        'src/prepare-bin.ts',
    ],
    format: ['cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    noExternal: [ /(.*)/ ],
});
