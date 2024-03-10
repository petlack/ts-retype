import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/ts-retype.ts'],
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: false,
    shims: true,
    format: ['cjs'],
    noExternal: [ /(.*)/ ],
});
