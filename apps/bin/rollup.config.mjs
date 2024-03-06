import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { tsSource } from '../../rollup.config.stats.mjs';

const tsRetype = tsSource('ts-retype.ts');

const config = [
    tsSource('index.ts'),
    {
        ...tsRetype,
        external: ['fs', 'path', 'readline'],
        output: {
            ...tsRetype.output,
            format: 'cjs',
        },
        plugins: [
            nodeResolve({
                preferBuiltins: true,
            }),
            commonjs(),
            ...tsRetype.plugins,
        ]
    },
];

export default config;
