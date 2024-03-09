import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/ts-retype.ts'],
    splitting: false,
    sourcemap: true,
    clean: false,
    format: ['cjs'],
    noExternal: [ /(.*)/ ],
});
