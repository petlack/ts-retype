import { tsSource, tsTypes } from '../../rollup.config.stats.mjs';

const config = [
    tsSource('index.ts'),
    tsSource('highlight.ts'),
    tsSource('snippet.ts'),
    tsSource('types.ts'),
    tsTypes('index.ts'),
];

export default config;
