import { tsSource } from '../../rollup.config.stats.mjs';

const config = [
    tsSource('index.ts'),
    tsSource('types.ts'),
];

export default config;
