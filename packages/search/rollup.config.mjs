import { nodeResolve } from '@rollup/plugin-node-resolve';
import { tsSource, tsTypes } from '../../rollup.config.stats.mjs';

const index = tsSource('index.ts');

const config = [
    tsSource('types.ts'),
    tsTypes('types.ts'),
    {
        ...index,
        external: [
            'fs',
            'path',
            'readline',
            'typescript',
            'glob',
            'ramda',
        ],
        output: {
            ...index.output,
            format: 'cjs',
        },
        plugins: [
            nodeResolve({
                preferBuiltins: true,
            }),
            ...index.plugins,
        ]
    },
];

export default config;
