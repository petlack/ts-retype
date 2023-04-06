import { getAllCandidates, parse } from '../src/parse';
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
    const types = getAllCandidates(srcFile);

    const expected: CandidateType[] = [
      <FunctionCandidateType>{
        name: 'Fn',
        pos: [10, 49],
        lines: [1, 1],
        type: 'function',
        parameters: [
          { name: 'a', type: 'string', text: 'StringKeyword' },
          { name: 'b', type: 'number', text: 'NumberKeyword' },
        ],
        returnType: 'Promise<void>',
        signature: {
          name: '',
          params: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' },
          ],
          return: 'Promise<void>',
          strFull: '(a: string, b: number) => Promise<void>',
          strMin: '(string, number) => Promise<void>',
        },
      },
    ];

    expect(types).toEqual(expected);
  });
  test('enum declaration', () => {
    const sourceText = 'enum En { a, b }';
    const srcFile = createFile(sourceText);
    const types = getAllCandidates(srcFile);

    const expected: CandidateType[] = [
      <EnumCandidateType>{
        name: 'En',
        type: 'enum',
        pos: [0, 16],
        lines: [1, 1],
        members: ['a', 'b'],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('union declaration', () => {
    const sourceText = 'type Un = "a" | "b"';
    const srcFile = createFile(sourceText);
    const types = parse(srcFile);

    const expected: CandidateType[] = [
      <UnionCandidateType>{
        name: 'Un',
        type: 'union',
        pos: [10, 19],
        lines: [1, 1],
        types: ['a', 'b'],
      },
    ];

    expect(types).toEqual(expected);
  });
});
