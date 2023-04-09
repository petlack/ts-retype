import { similarity } from '../../src/similarity';
import { EnumCandidateType, Similarity } from '../../src/types';
import { expectSimilarity } from '../lib/tests';

describe('enum type', () => {
  test('same names, no members', () => {
    const given = similarity(
      { name: 'foo', type: 'enum', members: [], pos: [0, 0], lines: [1, 1] } as EnumCandidateType,
      { name: 'foo', type: 'enum', members: [], pos: [0, 0], lines: [1, 1] } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, same members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, different members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Abc', 'Xyz'],
      } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('different names, same members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
      {
        name: 'bar',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
  test('same names, extra member', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar'],
      } as EnumCandidateType,
      {
        name: 'foo',
        type: 'enum',
        pos: [0, 0],
        lines: [1, 1],
        members: ['Foo', 'Bar', 'Xyz'],
      } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('identical types with no properties and different names', () => {
    const given = similarity(
      { name: 'foo', type: 'enum', pos: [0, 0], lines: [1, 1], members: [] } as EnumCandidateType,
      { name: 'bar', type: 'enum', pos: [0, 0], lines: [1, 1], members: [] } as EnumCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});
