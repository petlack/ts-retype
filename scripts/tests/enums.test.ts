import { toEnumValue, safeToEnumValue } from '../src/lib/utils/enums';
import { Step } from '../src/config';

describe('getEnumValue', () => {
  it('returns null given null', () => {
    expect(toEnumValue(Step, null)).toBe(undefined);
  });
  it('returns undefined given invalid string', () => {
    expect(toEnumValue(Step, 'foobar')).toBe(undefined);
  });
  it('returns enum value given number', () => {
    expect(toEnumValue(Step, 0)).toBe(Step.buildDocs);
  });
  it('returns enum value given correct string', () => {
    expect(toEnumValue(Step, 'buildDocs')).toBe(Step.buildDocs);
  });
  it('returns enum value given typed-checked correct string', () => {
    expect(safeToEnumValue(Step, 'buildDocs')).toBe(Step.buildDocs);
  });
});
