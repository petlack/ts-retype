import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/utils.ts',
        'src/log.ts',
        'src/config.ts',
        'src/types.ts',
    ],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
