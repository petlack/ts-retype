import { similarity } from '../../src/similarity';
import { expectSimilarity } from '../lib/tests';
import { UnionCandidateType } from '../../src/types/candidate';
import { Similarity } from '../../src/types/similarity';

describe('union type', () => {
  test('same names, no members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        types: [],
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        types: [],
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, same members', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        src: '',
        offset: 0,
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        src: '',
        offset: 0,
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
        src: '',
        offset: 0,
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        src: '',
        offset: 0,
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
        src: '',
        offset: 0,
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'bar',
        type: 'union',
        src: '',
        offset: 0,
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
        src: '',
        offset: 0,
        pos: [0, 0],
        types: ['Foo', 'Bar'],
      } as UnionCandidateType,
      {
        name: 'foo',
        type: 'union',
        src: '',
        offset: 0,
        pos: [0, 0],
        types: ['Foo', 'Bar', 'Xyz'],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('identical types with no properties and different names', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'union',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
        types: [],
      } as UnionCandidateType,
      {
        name: 'bar',
        type: 'union',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
        types: [],
      } as UnionCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});
