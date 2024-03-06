import { tsSource } from '../../rollup.config.stats.mjs';

const config = [
    tsSource('clsx.ts'),
    tsSource('code.ts'),
    tsSource('hooks.ts'),
    tsSource('icons.tsx'),
    tsSource('index.ts'),
    tsSource('tree.ts'),
];

export default config;
