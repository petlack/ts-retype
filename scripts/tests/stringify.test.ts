import { stringifyNice } from '../src/stringify';

describe('stringify', () => {
  test('edge cases', () => {
    expect(stringifyNice({})).toEqual('{}');
    expect(stringifyNice([])).toEqual('[]');
    expect(stringifyNice(null)).toEqual('null');
    expect(stringifyNice(undefined)).toEqual('null');
    expect(stringifyNice(0)).toEqual('0');
    expect(stringifyNice(NaN)).toEqual('null');
    expect(stringifyNice(false)).toEqual('false');
    // expect(stringifyNice('"')).toEqual('\'"\'');
    // expect(stringifyNice('\'')).toEqual('\'\\\'\'');
  });
  describe('arrays', () => {
    test('short array', () => {
      expect(stringifyNice([0, 1, 2])).toEqual('[0, 1, 2]');
    });
    test('object with short array', () => {
      expect(stringifyNice({ a: [0, 1, 2] })).toEqual('{ a: [0, 1, 2] }');
    });

    test('object with 2 short arrays', () => {
      expect(stringifyNice({ a: [0, 1, 2], b: [0, 1, 2] })).toEqual(
        '{ a: [0, 1, 2], b: [0, 1, 2] }',
      );
    });

    test('object with 3 short arrays', () => {
      expect(stringifyNice({ a: [0, 1, 2], b: [0, 1, 2], c: [0, 1, 2] })).toEqual(`{
  a: [0, 1, 2],
  b: [0, 1, 2],
  c: [0, 1, 2]
}`);
    });

    test('short array of short objects', () => {
      expect(stringifyNice([{ a: 1 }, { b: 2 }])).toEqual('[{ a: 1 }, { b: 2 }]');
    });

    test('long array of short objects', () => {
      expect(stringifyNice([{ a: 1 }, { b: 2 }, { c: 3 }])).toEqual(`[
  { a: 1 },
  { b: 2 },
  { c: 3 }
]`);
    });
  });

  describe('all', () => {
    test('ok', () => {
      const given = {
        foo: [{ a: 1 }, { a: 2 }, { a: 1 }],
        bar: [
          {
            a: 1,
            b: 2,
            c: [1, 2],
            d: [3, 4],
          },
        ],
      };
      const expected = `{
  foo: [
    { a: 1 },
    { a: 2 },
    { a: 1 }
  ],
  bar: [
    {
      a: 1,
      b: 2,
      c: [1, 2],
      d: [3, 4]
    }
  ]
}`;
      expect(stringifyNice(given)).toEqual(expected);
    });
  });
});
