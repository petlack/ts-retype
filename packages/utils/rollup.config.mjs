import { tsSource, tsTypes } from '../../rollup.config.stats.mjs';

const config = [
    tsSource('index.ts'),
    tsSource('core.ts'),
    tsSource('tree.ts'),
    tsTypes('index.ts'),
    tsTypes('core.ts'),
    tsTypes('tree.ts'),
];

export default config;
