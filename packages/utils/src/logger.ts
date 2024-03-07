import { box, dimmedFg, enableColors, greenFg, redFg, yellowFg } from './colors.js';
import { formatDuration } from './time.js';

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

    #log(level: Level, ...args: unknown[]) {
        this.#loggedMessages++;
        const logArgs: unknown[] = [
            dimmedFg(formatDuration((new Date().getTime() - this.#createdAt.getTime()), 'text')),
        ];
        switch (level) {
        case 'info':
            logArgs.push(box('blue', 'INFO', 4));
            logArgs.push(...args);
            break;
        case 'ok':
            logArgs.push(box('green', 'OK', 4));
            logArgs.push(...args.map(a => greenFg(a as string)));
            break;
        case 'warn':
            logArgs.push(box('yellow', 'WARN', 4));
            logArgs.push(...args.map(a => yellowFg(a as string)));
            break;
        case 'error':
            logArgs.push(box('red', 'ERROR', 4));
            logArgs.push(...args.map(a => redFg(a as string)));
            break;
        }
        this.logFn(...logArgs);
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
}
