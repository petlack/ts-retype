import { expectSimilarity } from '../lib/tests';
import { similarity } from '../../src/similarity';
import { LiteralCandidateType } from '../../src/types/candidate';
import { Similarity } from '../../src/types/similarity';

describe('literal type', () => {
  test('identical types with no properties', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        properties: [],
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
      },
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        properties: [],
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
      },
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('identical types with primitive properties', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'StringKeyword' }],
      },
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'StringKeyword' }],
      },
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('types with different properties keys', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'StringKeyword' }],
      },
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'xyz', type: 'StringKeyword' }],
      },
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('types with different properties values', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'StringKeyword' }],
      },
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'NumberKeyword' }],
      },
    );
    expectSimilarity(given, Similarity.HasSimilarProperties);
  });
  test('types with subset of properties', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [
          { name: 'bar', type: 'StringKeyword' },
          { name: 'xyz', type: 'StringKeyword' },
        ],
      },
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        offset: 0,
        pos: [0, 0],
        properties: [{ name: 'bar', type: 'NumberKeyword' }],
      },
    );
    expectSimilarity(given, Similarity.HasSubsetOfProperties);
  });
  test('identical types with no properties and different names', () => {
    const given = similarity(
      <LiteralCandidateType>{
        name: 'foo',
        type: 'literal',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
        properties: [],
      },
      <LiteralCandidateType>{
        name: 'bar',
        type: 'literal',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [0, 0],
        properties: [],
      },
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
});