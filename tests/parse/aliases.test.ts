import { removeAliasDuplicates } from '../../src/parse';

describe('aliases', () => {
  it('does not remove anything if there is no alias', () => {
    expect(removeAliasDuplicates([{ name: 'anonymous', pos: [1, 10], type: 'interface' }])).toEqual(
      [{ name: 'anonymous', pos: [1, 10], type: 'interface' }],
    );
  });

  it('removes types ending at the same position', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', pos: [0, 10], type: 'alias' },
        { name: 'anonymous', pos: [1, 10], type: 'interface' },
      ]),
    ).toEqual([{ name: 'a', pos: [0, 10], type: 'interface' }]);
  });

  it('does not remove nested type', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', pos: [0, 10], type: 'alias' },
        { name: 'anonymous', pos: [1, 10], type: 'interface' },
        { name: 'anonymous', pos: [3, 6], type: 'literal' },
      ]),
    ).toEqual([
      { name: 'a', pos: [0, 10], type: 'interface' },
      { name: 'anonymous', pos: [3, 6], type: 'literal' },
    ]);
  });

  it('removes type at different ending', () => {
    expect(
      removeAliasDuplicates([
        { name: 'a', pos: [0, 10], type: 'alias' },
        { name: 'anonymous', pos: [1, 9], type: 'interface' },
      ]),
    ).toEqual([{ name: 'a', pos: [0, 10], type: 'interface' }]);
  });
});
