import { posToLine } from '../src/utils';

describe('posToLine', () => {
  it('works with empty', () => {
    const toLine = posToLine([0]);
    expect(toLine(0)).toBe(1);
    expect(toLine(1)).toBe(2);
    expect(toLine(2)).toBe(2);
  });
  it('works with one line', () => {
    const given = [7];
    const toLine = posToLine([7]);
    expect(toLine(0)).toBe(1);
    expect(toLine(1)).toBe(1);
    expect(toLine(given.length - 1)).toBe(1);
    expect(toLine(given.length)).toBe(1);
    expect(toLine(given.length + 1)).toBe(1);
  });
  it('works with multiple lines', () => {
    const toLine = posToLine([3, 3]);
    expect(toLine(0)).toBe(1);
    expect(toLine(1)).toBe(1);
    expect(toLine(3)).toBe(1);
    expect(toLine(4)).toBe(2);
    expect(toLine(6)).toBe(2);
    expect(toLine(7)).toBe(3);
  });
  it('works with empty lines', () => {
    const toLine = posToLine([0, 3, 0, 0, 3, 0]);
    expect(toLine(0)).toBe(1);
    expect(toLine(1)).toBe(2);
    expect(toLine(3)).toBe(2);
    expect(toLine(4)).toBe(5);
    expect(toLine(6)).toBe(5);
    expect(toLine(7)).toBe(7);
  });
});