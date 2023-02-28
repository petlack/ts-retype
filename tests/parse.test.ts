import { getAllLiteralTypes } from '../src/parse';
import { LiteralType } from '../src/types';
import { createFile } from '../src/utils';

describe('parse', () => {
  test('simple type', () => {
    const sourceText = `type A = {
      message: string
      status: number;
    }`;
    const srcFile = createFile(sourceText);
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'A',
        pos: [0, 60],
        properties: [
          { key: 'message', value: 'string', type: 'StringKeyword' },
          { key: 'status', value: 'number', type: 'NumberKeyword' },
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
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'B',
        pos: [0, 73],
        properties: [
          { key: 'message', value: 'string', type: 'StringKeyword' },
          { key: 'status', value: 'number', type: 'NumberKeyword' },
          { key: 'foo', value: 'A', type: 'TypeReference' },
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
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'IFoo',
        pos: [0, 79],
        properties: [
          { key: 'foo', value: '(a: string) => number', type: 'FunctionType' },
          { key: 'bar', value: 'A', type: 'TypeReference' },
          { key: 'baz', value: 'B', type: 'TypeReference' },
        ],
      },
    ];

    expect(types).toEqual(expected);
  });
  test('function return type', () => {
    const sourceText = 'type GenericFn<T> = (x: T) => { foo: string, bar: number }';
    const srcFile = createFile(sourceText);
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        pos: [29, 58],
        properties: [
          { key: 'foo', value: 'string', type: 'StringKeyword' },
          { key: 'bar', value: 'number', type: 'NumberKeyword' },
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
    const types = getAllLiteralTypes(srcFile);

    const expected: LiteralType[] = [];

    expect(types).toEqual(expected);
  });

  test('object declaration', () => {
    const sourceText = 'const xyz: { [key: string]: number, foo: number } = { abc: 9, foo: 9 };';
    const srcFile = createFile(sourceText);
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        pos: [10, 49],
        properties: [
          { key: 'string', value: 'number', type: 'NumberKeyword' },
          { key: 'foo', value: 'number', type: 'NumberKeyword' },
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
    const types = getAllLiteralTypes(srcFile);

    const expected = [
      {
        name: 'anonymous',
        pos: [25, 28],
        properties: [],
      },
      {
        name: 'anonymous',
        pos: [46, 65],
        properties: [{ key: 'symbol', value: 'T', type: 'TypeReference' }],
      },
    ];

    expect(types).toEqual(expected);
  });
});
