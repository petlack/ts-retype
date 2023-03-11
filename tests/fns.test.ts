import { getAllCandidateTypes } from '../src/parse';
import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
} from '../src/types';
import { createFile } from '../src/utils';

describe('parse', () => {
  test('function declaration', () => {
    const sourceText = 'type Fn = (a: string, b: number) => Promise<void>';
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected: CandidateType[] = [
      <FunctionCandidateType>{
        name: 'Fn',
        pos: [0, 49],
        type: 'function',
        parameters: [
          { key: 'a', value: 'string', type: 'StringKeyword' },
          { key: 'b', value: 'number', type: 'NumberKeyword' },
        ],
        returnType: 'Promise<void>',
      },
    ];

    expect(types).toEqual(expected);
  });
  test('enum declaration', () => {
    const sourceText = 'enum En { a, b }';
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected: CandidateType[] = [
      <EnumCandidateType>{
        name: 'En',
        type: 'enum',
        pos: [0, 16],
        members: ['a', 'b'],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('union declaration', () => {
    const sourceText = 'type Un = "a" | "b"';
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected: CandidateType[] = [
      <UnionCandidateType>{
        name: 'Un',
        type: 'union',
        pos: [0, 19],
        types: ['a', 'b'],
      },
    ];

    expect(types).toEqual(expected);
  });
});
