import { similarity } from '../../src/similarity';
import { expectSimilarity } from '../lib/tests';
import { FunctionCandidateType, Property } from '../../src/types/candidate';
import { Similarity } from '../../src/types/similarity';

describe('function type', () => {
  test('same names, same return types, no parameters', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters: [],
        returnType: 'void',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
        signature: { params: [] },
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters: [],
        returnType: 'void',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
        signature: { params: [] },
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
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'void',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
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
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters,
        returnType: 'number',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
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
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters: parametersB,
        returnType: 'void',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
      } as FunctionCandidateType,
    );
    expectSimilarity(given, Similarity.HasIdenticalProperties);
  });
  test('same names, same return type, different parameters count', () => {
    const given = similarity(
      {
        name: 'foo',
        type: 'function',
        parameters: [{ name: 'a', type: 'string' }],
        returnType: 'void',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
        signature: { params: [] },
      } as FunctionCandidateType,
      {
        name: 'foo',
        type: 'function',
        parameters: [
          { name: 'b', type: 'string' },
          { name: 'c', type: 'string' },
        ],
        returnType: 'void',
        src: '',
        offset: 0,
        pos: [0, 0],
        lines: [1, 1],
        signature: { params: [] },
      } as FunctionCandidateType,
    );
    expectSimilarity(given, Similarity.Different);
  });
});
