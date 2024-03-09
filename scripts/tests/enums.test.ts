import { toEnumValue, safeToEnumValue } from '../src/utils/enums.js';
import { Step } from '../src/config.js';

describe('getEnumValue', () => {
  it('returns null given null', () => {
    expect(toEnumValue(Step, null)).toBe(undefined);
  });
  it('returns undefined given invalid string', () => {
    expect(toEnumValue(Step, 'foobar')).toBe(undefined);
  });
  it('returns enum value given number', () => {
    expect(toEnumValue(Step, 0)).toBe(Step.buildClikit);
  });
  it('returns enum value given correct string', () => {
    expect(toEnumValue(Step, 'buildClikit')).toBe(Step.buildClikit);
  });
  it('returns enum value given typed-checked correct string', () => {
    expect(safeToEnumValue(Step, 'buildClikit')).toBe(Step.buildClikit);
  });
});
