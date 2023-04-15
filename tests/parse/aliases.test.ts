import { removeAliasDuplicates } from '../../src/parse';

describe('aliases', () => {
  it('does not remove anything if there is no alias', () => {
    expect(
      removeAliasDuplicates([
        { name: 'anonymous', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
      ]),
    ).toEqual([{ name: 'anonymous', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' }]);
  });

  it('removes types ending at the same position', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
        { name: 'anonymous', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
      ]),
    ).toEqual([{ name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' }]);
  });

  it('does not remove nested type', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
        { name: 'anonymous', offset: 0, pos: [1, 10], lines: [1, 1], type: 'interface' },
        { name: 'anonymous', offset: 0, pos: [3, 6], lines: [1, 1], type: 'literal' },
      ]),
    ).toEqual([
      { name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' },
      { name: 'anonymous', offset: 0, pos: [3, 6], lines: [1, 1], type: 'literal' },
    ]);
  });

  it('removes type at different ending', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'alias' },
        { name: 'anonymous', offset: 0, pos: [1, 9], lines: [1, 1], type: 'interface' },
      ]),
    ).toEqual([{ name: 'a', offset: 0, pos: [0, 10], lines: [1, 1], type: 'interface' }]);
  });
});
