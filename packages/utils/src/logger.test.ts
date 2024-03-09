import { describe, expect, it } from 'vitest';
import { Formatter, Logger } from './logger.js';
import { stripColors } from './colors.js';

describe('Logger', () => {
    it('logs an info message', () => {
        const buffer: string[] = [];
        const logger = new Logger('foo', (...msgs) => buffer.push(msgs.join(' ')));
        logger.info('Hello, world!');
        expect(buffer.map(stripColors)).toEqual([
            ' ℹ️  0.000s [foo]    Hello, world!',
        ]);
    });
    it('stringifies simple objects', () => {
        const buffer: string[] = [];
        const logger = new Logger(undefined, (...msgs) => buffer.push(msgs.join(' ')));
        logger.info({ foo: 'bar' });
        expect(buffer.map(stripColors)).toEqual([
            ' ℹ️  0.000s { "foo": "bar" }',
        ]);
    });
    it('stringifies simple object with name', () => {
        const buffer: string[] = [];
        const logger = new Logger(undefined, (...msgs) => buffer.push(msgs.join(' ')));
        logger.info('foo', { foo: 'bar' });
        expect(buffer.map(stripColors)).toEqual([
            ' ℹ️  0.000s foo { "foo": "bar" }',
        ]);
    });
    it('stringifies complex objects', () => {
        const buffer: string[] = [];
        const logger = new Logger(undefined, (...msgs) => buffer.push(msgs.join(' ')));
        logger.info('foo', { foo: 'bar', baz: 42 });
        expect(buffer.map(stripColors).join('\n')).toEqual([
            ' ℹ️  0.000s foo {',
            '               "foo": "bar",',
            '               "baz": 42',
            '           }'
        ].join('\n'));
    });
});

describe('Formatter', () => {
    const formatter = new Formatter();
    it('formats simple types', () => {
        expect(formatter.format(undefined)).toEqual('undefined');
        expect(formatter.format(null)).toEqual('null');
        expect(formatter.format(0)).toEqual('0');
        expect(formatter.format(0.0)).toEqual('0');
        expect(formatter.format(false)).toEqual('false');
        expect(formatter.format('foo')).toEqual('foo');
    });
    it('formats functions', () => {
        expect(formatter.format(() => {})).toEqual('[Function]');
        expect(formatter.format(function foo() {})).toEqual('[Function: foo]');
    });
    it('formats simple objects', () => {
        expect(formatter.format({})).toEqual('{}');
        expect(formatter.format({ foo: 'bar' })).toEqual('{ "foo": "bar" }');
    });
    it('formats combination of simple types and simple objects', () => {
        expect(formatter.stringify(['foo', { foo: 'bar', baz: 42 }])).toEqual([
            'foo',
            '{',
            '    "foo": "bar",',
            '    "baz": 42',
            '}'].join('\n')
        );
    });
    it('formats array of simple objects', () => {
        expect(formatter.format([{}])).toEqual([
            '[',
            '    {}',
            ']'].join('\n')
        );
        expect(formatter.format([{ foo: 'bar' }])).toEqual([
            '[',
            '    {"foo":"bar"}',
            ']'].join('\n')
        );
    });
});
