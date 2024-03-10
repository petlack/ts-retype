import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/ts-retype.ts'],
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: true,
    shims: true,
    format: ['cjs'],
    noExternal: [ /(.*)/ ],
});
