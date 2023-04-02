import { similarity } from '../../src/similarity';
import { UnionCandidateType, Similarity } from '../../src/types';
import { expectSimilarity } from '../lib/tests';

describe('union type', () => {
  test('same names, no members', () => {
    const given = similarity(
      { name: 'foo', type: 'union', types: [], pos: [0, 0] } as UnionCandidateType,
      { name: 'foo', type: 'union', types: [], pos: [0, 0] } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, same members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, different members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Abc', 'Xyz'],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('different names, same members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'bar',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
  test('same names, extra member', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        pos: [0, 0],
        types: ['Foo', 'Bar', 'Xyz'],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('identical types with no properties and different names', () => {
    const given = similarity(
      { name: 'foo', type: 'union', pos: [0, 0], types: [] } as UnionCandidateType,
      { name: 'bar', type: 'union', pos: [0, 0], types: [] } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});
