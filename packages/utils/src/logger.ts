import {
    blue,
    dimmed,
    enableColors,
    green,
    red,
    yellow,
} from './colors.js';
import { clearLine, cursorTo } from 'readline';
import { formatDuration } from './time.js';
import { formatJson, stringify } from './core.js';

type LogFn = (msg: string) => void;
type Level = 'info' | 'ok' | 'warn' | 'error';

enableColors();

export class Logger {
    #createdAt = new Date();
    #loggedMessages = 0;
    #formatter: Formatter;

    constructor(
        private readonly tag: string | undefined = undefined,
        // eslint-disable-next-line no-console
        private readonly logFn: LogFn = console.log,
    ) {
        this.#formatter = new Formatter();
    }

    amend(msg: string, newline = false) {
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0);
        process.stdout.write(msg);
        if (newline) {
            process.stdout.write('\n');
        }
    }

    bare(...msgs: unknown[]) {
        this.logFn(msgs.map(stringify).join(' '));
    }

    info(...msgs: unknown[]) {
        this.#log('info', ...msgs);
    }

    ok(...msgs: unknown[]) {
        this.#log('ok', ...msgs);
    }

    table(msg: unknown) {
        // eslint-disable-next-line no-console
        console.table(msg);
    }

    warn(...msgs: unknown[]) {
        this.#log('warn', ...msgs);
    }

    error(...msgs: unknown[]) {
        this.#log('error', ...msgs);
    }

    #log(
        level: Level,
        ...args: unknown[]
    ): void {
        this.#loggedMessages++;
        const tag = this.tag && `[${this.tag}]`;
        const logArgs: unknown[] = [
            dimmed(this.#duration()),
            ...(tag ? [dimmed(tag)] : []),
        ];
        switch (level) {
        case 'info':
            logArgs.unshift(blue(' ℹ️ '));
            logArgs.push(this.#stringify(args));
            break;
        case 'ok':
            logArgs.unshift(green(' ✅'));
            logArgs.push(green(this.#stringify(args)));
            break;
        case 'warn':
            logArgs.unshift(yellow(' ⚠️'));
            logArgs.push(yellow(this.#stringify(args)));
            break;
        case 'error':
            logArgs.unshift(red(' ⛔'));
            logArgs.push(red(this.#stringify(args)));
            break;
        }
        this.logFn(logArgs.join(' '));
    }

    #duration(): string {
        return formatDuration(
            new Date().getTime() - this.#createdAt.getTime(),
            'text'
        );
    }

    #pad(msg: unknown): string {
        const tag = this.tag?.length ?? -1;
        const duration = this.#duration().length;
        const pad = ' '.repeat(2 + tag + duration + 2);
        return `${pad}  ${msg}`;
    }

    #stringify(args: unknown[]): string {
        if (args.length === 1) return this.#formatter.format(args[0]);
        return args
            .map(arg => this.#formatter.format(arg).split('\n'))
            .map(lines => {
                if (lines.length === 1) return lines[0];
                return [
                    lines[0],
                    ...lines.slice(1).map(line => this.#pad(line)),
                ].join('\n');
            }).join(' ');
    }

}

function getArgType(arg: unknown): 'null' | 'simple' | 'date' | 'array' | 'object' | 'function' {
    if (arg == null) return 'null';
    switch (typeof arg) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
    case 'undefined':
        return 'simple';
    case 'function':
        return 'function';
    case 'object':
        if (arg instanceof Date) {
            return 'date';
        }
        if (Array.isArray(arg)) {
            return 'array';
        }
        return 'object';
    }
    return 'simple';
}

export class Formatter {
    stringify(args: unknown[]): string {
        if (args.length === 1) return this.format(args[0]);
        return args.map(arg => this.format(arg)).join('\n');
    }
    format(arg: unknown): string {
        if (arg == null) return String(arg);
        switch (getArgType(arg)) {
        case 'simple':
        case 'null':
            return String(arg);
        case 'function':
            // eslint-disable-next-line @typescript-eslint/ban-types
            return (arg as Function).name ?
                // eslint-disable-next-line @typescript-eslint/ban-types
                `[Function: ${(arg as Function).name}]` :
                '[Function]';
        case 'date':
            return (arg as Date).toISOString();
        case 'array':
            return formatArray(arg as unknown[], 4);
        case 'object':
            return formatJson(arg, 4);
        }
    }
}

function formatArray(arg: unknown[], tabsize = 2): string {
    const buffer = [];
    for (const value of arg) {
        switch (getArgType(value)) {
        case 'null':
        case 'date':
        case 'function':
        case 'simple':
            buffer.push(stringify(value));
            break;
        case 'object':
            buffer.push(JSON.stringify(value));
            break;
        case 'array':
            buffer.push(JSON.stringify(value));
            break;
        }
    }
    return [
        '[',
        ...buffer.map(line => ' '.repeat(tabsize) + line),
        ']'
    ].join('\n');
}
