import { combinations, Facet, facetStats, getFacetStat } from '../../src/model/search';

describe('combinations', () => {
  it('combines multiple arrays of different types', () => {
    const given = combinations<string | boolean | number>([
      ['a', 'b'],
      [true, false],
      [1, 2],
    ]);
    const expected = [
      ['a', true, 1],
      ['a', true, 2],
      ['a', false, 1],
      ['a', false, 2],
      ['b', true, 1],
      ['b', true, 2],
      ['b', false, 1],
      ['b', false, 2],
    ];
    expect(given).toEqual(expected);
  });
  it('combines different sized arrays', () => {
    const given = combinations([
      ['a', 'b', 'c'],
      ['x', 'y'],
    ]);
    const expected = [
      ['a', 'x'],
      ['a', 'y'],
      ['b', 'x'],
      ['b', 'y'],
      ['c', 'x'],
      ['c', 'y'],
    ];
    expect(given).toEqual(expected);
  });
});

describe('facetStats', () => {
  it('ok', () => {
    type Rec = { type: 'x' | 'y'; color: 'a' | 'b'; rating: number; price: number };
    const data: Rec[] = [
      { type: 'x', color: 'b', rating: 1, price: 1 },
      { type: 'x', color: 'b', rating: 1, price: 2 },
      { type: 'x', color: 'b', rating: 2, price: 1 },
      { type: 'y', color: 'a', rating: 3, price: 1 },
      { type: 'y', color: 'a', rating: 3, price: 3 },
      { type: 'y', color: 'b', rating: 1, price: 0 },
    ];
    const facets: Facet<Rec>[] = [
      { name: 'type', values: ['x', 'y'], matches: (rec, v) => rec.type === v },
      { name: 'color', values: ['a', 'b'], matches: (rec, v) => rec.color === v },
      { name: 'rating', values: [1, 2, 3], matches: (rec, v) => rec.rating === v },
    ];
    const given = facetStats(data, facets);
    expect(getFacetStat(given, 'x', 'b', 1)).toEqual(2);
    expect(getFacetStat(given, 'x', 'b', 2)).toEqual(1);
    expect(getFacetStat(given, 'x', 'a', 1)).toEqual(0);
    expect(getFacetStat(given, 'y', 'a', 1)).toEqual(0);
    expect(getFacetStat(given, 'y', 'a', 3)).toEqual(2);
    expect(getFacetStat(given, 'y', 'b', 1)).toEqual(1);
  });
});
