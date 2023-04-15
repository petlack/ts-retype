import { parse } from '../../src/parse';
import { createFile } from '../../src/utils';
import { FunctionCandidateType } from '../types/candidate';

describe('parse', () => {
  test('simple type', () => {
    const src = `type A = {
      message: string
      status: number;
    }`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'A',
        type: 'literal',
        pos: [9, 60],
        offset: 9,
        lines: [1, 4],
        properties: [
          { name: 'message', type: 'string', text: 'StringKeyword' },
          { name: 'status', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('simple type', () => {
    const src = `// comment
    type B = {
      message: string
      status: number
      foo: A
    };`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'B',
        type: 'literal',
        pos: [24, 87],
        offset: 24,
        lines: [2, 6],
        properties: [
          { name: 'message', type: 'string', text: 'StringKeyword' },
          { name: 'status', type: 'number', text: 'NumberKeyword' },
          { name: 'foo', type: 'A', text: 'TypeReference' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('interface', () => {
    const src = `interface IFoo {
      foo: (a: string) => number
      bar: A
      baz: B
  }`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'IFoo',
        type: 'interface',
        pos: [0, 79],
        offset: 0,
        lines: [1, 5],
        properties: [
          { name: 'foo', type: '(a: string) => number', text: 'FunctionType' },
          { name: 'bar', type: 'A', text: 'TypeReference' },
          { name: 'baz', type: 'B', text: 'TypeReference' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('function return type', () => {
    const src = 'type GenericFn<T> = (x: T) => { foo: string, bar: number }';
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'GenericFn',
        type: 'function',
        pos: [20, 58],
        offset: 20,
        lines: [1, 1],
        parameters: [{ name: 'x', type: 'T', text: 'TypeReference' }],
        returnType: '{ foo: string, bar: number }',
        signature: {
          name: '',
          params: [{ name: 'x', type: 'T' }],
          return: '{ foo: string, bar: number }',
          strFull: '(x: T) => { foo: string, bar: number }',
          strMin: '(T) => { foo: string, bar: number }',
        },
      },
      {
        name: 'anonymous',
        type: 'literal',
        pos: [30, 58],
        offset: 30,
        lines: [1, 1],
        properties: [
          { name: 'foo', type: 'string', text: 'StringKeyword' },
          { name: 'bar', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('function declaration', () => {
    const src = `function foo(bar: string): string {
      return bar.toUpperCase();
    }`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'foo',
        type: 'function',
        pos: [0, 73],
        offset: 0,
        lines: [1, 3],
        signature: {
          name: 'foo',
          params: [{ name: 'bar', type: 'string' }],
          return: 'string',
          strMin: '(string) => string',
          strFull: 'foo(bar: string) => string',
        },
        parameters: [{ name: 'bar', type: 'string', text: 'StringKeyword' }],
        returnType: 'string',
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('object declaration', () => {
    const src = 'const xyz: { [key: string]: number, foo: number } = { abc: 9, foo: 9 };';
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'literal',
        pos: [11, 49],
        offset: 11,
        lines: [1, 1],
        properties: [
          { name: 'string', type: 'number', text: 'NumberKeyword' },
          { name: 'foo', type: 'number', text: 'NumberKeyword' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('{} type', () => {
    const src = `
    const a = <T extends {}>([s, n]: [string, { [b: symbol]: T }]): Map<string, number> => new Map<string, number>();
    `;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'literal',
        pos: [26, 28],
        offset: 26,
        lines: [2, 2],
        properties: [],
      },
      {
        name: 'anonymous',
        type: 'literal',
        offset: 47,
        pos: [47, 65],
        lines: [2, 2],
        properties: [{ name: 'symbol', type: 'T', text: 'TypeReference' }],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('intersection of types', () => {
    const src = `
    type FunctionTypeCluster = Pick<
      FunctionCandidateType,
      'name' | 'type' | 'parameters' | 'returnType'
    > & {
      files: SourceFile[];
      names: Freq;
      group: string;
    }`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'anonymous',
        type: 'union',
        pos: [73, 118],
        offset: 35,
        lines: [4, 4],
        types: ['name', 'type', 'parameters', 'returnType'],
      },
      {
        name: 'anonymous',
        pos: [127, 201],
        offset: 60,
        lines: [5, 9],
        properties: [
          { name: 'files', type: 'SourceFile[]', text: 'ArrayType' },
          { name: 'names', type: 'Freq', text: 'TypeReference' },
          { name: 'group', type: 'string', text: 'StringKeyword' },
        ],
        type: 'literal',
      },
    ];

    expect(candidates).toMatchObject(expected);
  });

  test('nested type', () => {
    const src = `type A = {
      message: string
      status: { code: number, title: string };
    }`;
    const srcFile = createFile(src);
    const candidates = parse(srcFile);

    const expected = [
      {
        name: 'A',
        type: 'literal',
        offset: 9,
        pos: [9, 85],
        lines: [1, 4],
        properties: [
          { name: 'message', type: 'string', text: 'StringKeyword' },
          { name: 'status', type: '{ code: number, title: string }', text: 'TypeLiteral' },
        ],
      },
      {
        name: 'anonymous',
        type: 'literal',
        pos: [47, 78],
        offset: 36,
        lines: [3, 3],
        properties: [
          { name: 'code', type: 'number', text: 'NumberKeyword' },
          { name: 'title', type: 'string', text: 'StringKeyword' },
        ],
      },
    ];

    expect(candidates).toMatchObject(expected);
  });
});
