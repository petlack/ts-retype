import { describe, expect, it } from 'vitest';
import { posToLine } from '../src/utils.js';

describe('posToLine', () => {
    it('works with empty', () => {
        const toLine = posToLine([0]);
        expect(toLine(0)).toBe(1);
        expect(toLine(1)).toBe(2);
        expect(toLine(2)).toBe(2);
    });
    it('works with one line', () => {
        const toLine = posToLine([7]);
        expect(toLine(0)).toBe(1);
        expect(toLine(1)).toBe(1);
        expect(toLine(7)).toBe(1);
        expect(toLine(8)).toBe(2);
        expect(toLine(9)).toBe(2);
    });
    it('works with multiple lines', () => {
        const toLine = posToLine([3, 3]);
        expect(toLine(0)).toBe(1);
        expect(toLine(1)).toBe(1);
        expect(toLine(2)).toBe(1);
        expect(toLine(3)).toBe(1);
        expect(toLine(4)).toBe(2);
        expect(toLine(5)).toBe(2);
        expect(toLine(6)).toBe(2);
        expect(toLine(7)).toBe(2);
        expect(toLine(8)).toBe(3);
        expect(toLine(9)).toBe(3);
    });
    it('works with empty lines', () => {
        const toLine = posToLine([0, 3, 0, 0, 3, 0]);
        expect(toLine(0)).toBe(1);
        expect(toLine(1)).toBe(2);
        expect(toLine(2)).toBe(2);
        expect(toLine(3)).toBe(2);
        expect(toLine(4)).toBe(2);
        expect(toLine(5)).toBe(3);
        expect(toLine(6)).toBe(4);
        expect(toLine(7)).toBe(5);
        expect(toLine(8)).toBe(5);
        expect(toLine(9)).toBe(5);
        expect(toLine(10)).toBe(5);
        expect(toLine(11)).toBe(6);
        expect(toLine(12)).toBe(7);
        expect(toLine(13)).toBe(7);
    });
});
