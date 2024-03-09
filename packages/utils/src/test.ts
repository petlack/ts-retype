import { Logger } from './logger.js';

const logger = new Logger(undefined, () => {});

for (const idx of Array(20).keys()) {
    logger.update.info(idx.toLocaleString().padStart(3, '.').repeat(11));
}

console.log();
