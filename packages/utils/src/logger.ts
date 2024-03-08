import {
    box,
    dimmed,
    enableColors,
    green,
    red,
    yellow,
} from './colors.js';
import { clearLine, cursorTo } from 'readline';
import { formatDuration } from './time.js';
import { stringify } from './core.js';

type LogFn = (...msgs: unknown[]) => void;
type Level = 'info' | 'ok' | 'warn' | 'error';

enableColors();

export class Logger {
    #createdAt = new Date();
    #loggedMessages = 0;

    constructor(
        // eslint-disable-next-line no-console
        private readonly logFn: LogFn = console.log,
    ) { }

    amend(msg: string, newline = false) {
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0);
        process.stdout.write(msg);
        if (newline) {
            process.stdout.write('\n');
        }
    }

    bare(...msgs: unknown[]) {
        this.logFn(...msgs.map(stringify));
    }

    info(...msgs: unknown[]) {
        this.#log('info', ...msgs);
    }

    ok(...msgs: unknown[]) {
        this.#log('ok', ...msgs);
    }

    warn(...msgs: unknown[]) {
        this.#log('warn', ...msgs);
    }

    error(...msgs: unknown[]) {
        this.#log('error', ...msgs);
    }

    #log(level: Level, ...args: unknown[]) {
        this.#loggedMessages++;
        const logArgs: unknown[] = [
            dimmed(formatDuration((new Date().getTime() - this.#createdAt.getTime()), 'text')),
        ];
        switch (level) {
        case 'info':
            logArgs.push(box('blue', 'INFO', 4));
            logArgs.push(...args);
            break;
        case 'ok':
            logArgs.push(box('green', 'OK', 4));
            logArgs.push(...args.map(a => green(a as string)));
            break;
        case 'warn':
            logArgs.push(box('yellow', 'WARN', 4));
            logArgs.push(...args.map(a => yellow(a as string)));
            break;
        case 'error':
            logArgs.push(box('red', 'ERROR', 4));
            logArgs.push(...args.map(a => red(a as string)));
            break;
        }
        this.logFn(...logArgs.map(stringify));
    }

}
