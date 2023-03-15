import { findTypeDuplicates } from '../src/clusters';

describe('clusters', () => {
  test('ok', () => {
    const given = { foo: 1 };
    const expected = { foo: 1 };
    expect(given).toEqual(expected);
  });
});
