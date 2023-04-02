import { similarity } from '../../src/similarity';
import { UnionCandidateType, Similarity, FunctionCandidateType, Property } from '../../src/types';
import { expectSimilarity } from '../lib/tests';

describe('function type', () => {
  test('same names, same return types, no parameters', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters: [],
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters: [],
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, same return type, same parameters', () => {
    const parameters = [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'string' },
    ] as Property[];
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
    );
    expectSimilarity(given, Similarity.Identical);
  });
  test('same names, different return type, same parameters', () => {
    const parameters = [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'string' },
    ] as Property[];
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'number',
        pos: [0, 0],
      } as FunctionCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
  test('same names, same return type, renamed parameters', () => {
    const parametersA = [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'number' },
    ] as Property[];
    const parametersB = [
      { name: 'x', type: 'string' },
      { name: 'y', type: 'number' },
    ] as Property[];
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters: parametersA,
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters: parametersB,
        returnType: 'void',
        pos: [0, 0],
      } as FunctionCandidateType,
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
