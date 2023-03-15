import { getAllCandidateTypes } from '../src/parse';
import { LiteralCandidateType } from '../src/types';
import { createFile } from '../src/utils';

describe('parse', () => {
  test('simple type', () => {
    const sourceText = `type A = {
      message: string
      status: number;
    }`;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'A',
        type: 'alias',
        pos: [0, 60],
        properties: [
          { name: 'message', type: 'string', text: 'StringKeyword' },
          { name: 'status', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('simple type', () => {
    const sourceText = `type B = {
      message: string
      status: number
      foo: A
    };`;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'B',
        type: 'alias',
        pos: [0, 73],
        properties: [
          { name: 'message', type: 'string', text: 'StringKeyword' },
          { name: 'status', type: 'number', text: 'NumberKeyword' },
          { name: 'foo', type: 'A', text: 'TypeReference' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('interface', () => {
    const sourceText = `interface IFoo {
      foo: (a: string) => number
      bar: A
      baz: B
  }`;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'IFoo',
        type: 'interface',
        pos: [0, 79],
        properties: [
          { name: 'foo', type: '(a: string) => number', text: 'FunctionType' },
          { name: 'bar', type: 'A', text: 'TypeReference' },
          { name: 'baz', type: 'B', text: 'TypeReference' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('function return type', () => {
    const sourceText = 'type GenericFn<T> = (x: T) => { foo: string, bar: number }';
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'GenericFn',
        type: 'function',
        pos: [0, 58],
        parameters: [{ name: 'x', type: 'T', text: 'TypeReference' }],
        returnType: '{ foo: string, bar: number }',
      },
      {
        name: 'anonymous',
        type: 'literal',
        pos: [29, 58],
        properties: [
          { name: 'foo', type: 'string', text: 'StringKeyword' },
          { name: 'bar', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });

  test('function declaration', () => {
    const sourceText = `function foo(bar: string): string {
      return bar.toUpperCase();
    }`;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected: LiteralCandidateType[] = [];

    expect(types).toEqual(expected);
  });

  test('object declaration', () => {
    const sourceText = 'const xyz: { [key: string]: number, foo: number } = { abc: 9, foo: 9 };';
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'literal',
        pos: [10, 49],
        properties: [
          { name: 'string', type: 'number', text: 'NumberKeyword' },
          { name: 'foo', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });

  test('{} type', () => {
    const sourceText = `
    const a = <T extends {}>([s, n]: [string, { [b: symbol]: T }]): Map<string, number> => new Map<string, number>();
    `;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'literal',
        pos: [25, 28],
        properties: [],
      },
      {
        name: 'anonymous',
        type: 'literal',
        pos: [46, 65],
        properties: [{ name: 'symbol', type: 'T', text: 'TypeReference' }],
      },
    ];

    expect(types).toEqual(expected);
  });

  test('intersection of types', () => {
    const sourceText = `
    type FunctionTypeCluster = Pick<
      FunctionCandidateType,
      'name' | 'type' | 'parameters' | 'returnType'
    > & {
      files: SourceFile[];
      names: Freq;
      group: string;
    }`;
    const srcFile = createFile(sourceText);
    const types = getAllCandidateTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'union',
        pos: [66, 118],
        types: ['name', 'type', 'parameters', 'returnType'],
      },
      {
        name: 'anonymous',
        pos: [126, 201],
        properties: [
          { name: 'files', type: 'SourceFile[]', text: 'ArrayType' },
          { name: 'names', type: 'Freq', text: 'TypeReference' },
          { name: 'group', type: 'string', text: 'StringKeyword' },
        ],
        type: 'literal',
      },
    ];

    expect(types).toEqual(expected);
  });
});
