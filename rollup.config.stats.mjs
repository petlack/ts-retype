import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';

export function tsSource(filename) {
    const parts = filename.split('.').slice(0, -1);
    const name = parts.join('.');
    return {
        input: `src/${filename}`,
        output: {
            file: `dist/${name}.js`,
            format: 'es',
            exports: 'named',
            sourcemap: true,
        },
        plugins: [
            typescript(),
            visualizer({
                emitFile: true,
                filename: `stats-${name}.html`,
            })
        ],
    };
}

export function tsTypes(filename) {
    const parts = filename.split('.').slice(0, -1);
    const name = parts.join('.');
    return {
        input: `src/${filename}`,
        output: {
            file: `dist/${name}.d.ts`,
            format: 'es'
        },
        plugins: [dts()]
    };
}
