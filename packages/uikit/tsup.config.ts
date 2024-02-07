import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/code.ts',
        'src/hooks.ts',
        'src/index.ts',
        'src/tree.ts',
    ],
    // treeshake: true,
    // sourcemap: 'inline',
    // minify: true,
    // clean: true,
    dts: true,
    // splitting: false,
    format: ['cjs', 'esm'],
    // external: ['react'],
    // injectStyle: false,
});
