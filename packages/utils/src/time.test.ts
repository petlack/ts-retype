import { describe, expect, it } from 'vitest';
import { ONE_SECOND, ONE_MINUTE, formatDuration } from './time.js';

describe('formatDuration', () => {
    it('text format - formats milliseconds', () => {
        expect(formatDuration(0)).toBe('0.000s');
        expect(formatDuration(100)).toBe('0.100s');
        expect(formatDuration(ONE_MINUTE + 100)).toBe('1m 0.1s');
        expect(
            formatDuration(65*ONE_MINUTE + 30*ONE_SECOND + 130)
        ).toBe('1h 5m 30s');
    });
    it('digital format - formats durations', () => {
        expect(formatDuration(0, 'digital')).toBe('0.000');
        expect(formatDuration(3_100, 'digital')).toBe('3.100');
        expect(formatDuration(ONE_MINUTE + 100, 'digital')).toBe('01:00.100');
        expect(
            formatDuration(65*ONE_MINUTE + 30*ONE_SECOND + 130, 'digital')
        ).toBe('01:05:30.130');
    });
});
