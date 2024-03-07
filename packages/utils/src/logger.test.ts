import { describe, expect, it } from 'vitest';
import { Logger } from './logger.js';
import { stripColors } from './colors.js';

describe('Logger', () => {
    it('logs an info message', () => {
        const buffer: string[] = [];
        const logger = new Logger((...msgs) => buffer.push(msgs.join(' ')));
        logger.info('Hello, world!');
        expect(buffer.map(stripColors)).toEqual(['0.000s  INFO  Hello, world!']);
    });
});
