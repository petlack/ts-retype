import { panic, success } from './panic.js';
import { bold } from '../colors.js';
import { shortError } from '../core.js';
import { Logger } from '../logger.js';
import { formatDuration } from '../time.js';

/**
* Executes the Promise and logs OK.
*/
export async function execute(
    program: () => Promise<void>,
): Promise<void> {
    await executeFunction(
        panicOnError(program)
    );
    success();
}

/**
* Executes the Promise and logs the duration and failures.
* @returns The Promise result.
* @throws {Error} if the Promise rejects
*/
export function monitor<T>(
    promiseFn: () => Promise<T>,
    name?: string,
): () => Promise<T> {
    const tag = name ?? '';
    const log = new Logger(tag);
    return async () => {
        const startedAt = new Date().getTime();
        const logDuration = () => {
            const duration = formatDuration(new Date().getTime() - startedAt);
            log.bare();
            log.info(`Finished in ${bold(duration)}`);
        };
        log.info(`Running ${bold(tag)}`);
        log.bare();
        try {
            const res = await promiseFn();
            logDuration();
            log.ok('Done');
            return res;
        } catch (e: unknown) {
            logDuration();
            log.bare();
            log.error(`Failed to run with ${shortError(e)}`);
            throw e;
        }
    };
}

/**
* Executes the Promise and terminates the process if it fails.
*/
function panicOnError<T>(
    program: () => Promise<T>,
): () => Promise<T> {
    return async function boundary() {
        try {
            const res = await program();
            return res;
        } catch (err) {
            panic(err);
        }
    };
}

async function executeFunction(
    fn: () => void | Promise<void>,
): Promise<void> {
    if (fn instanceof Function) {
        const result = fn();
        if (result instanceof Promise) {
            await result;
        }
    }
}
