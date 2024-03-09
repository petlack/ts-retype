import { bold, panic, success } from './colors.js';
import { Logger } from './logger.js';
import { formatDuration } from './time.js';

const log = new Logger('cli');

/**
* Executes the Promise and logs the result.
*/
export async function execute(
    program: () => Promise<void>,
): Promise<void> {
    await executeFunction(
        check(program)
    );
    success();
}

function check<T>(
    program: () => Promise<T>,
): () => Promise<T> {
    return async function boundary() {
        try {
            const res = await program();
            return res;
        } catch (err) {
            if (err instanceof Error && err.stack) {
                log.error((err as Error).stack);
            }
            else if (err && typeof err === 'object' && 'message' in err) {
                log.error((err as { message: string }).message);
            } else {
                log.error(err);
            }
            panic((err as Error).message ?? 'Error');
        }
    };
}

export function monitor<T>(
    promiseFn: () => Promise<T>,
    name?: string,
): () => Promise<T> {
    const tag = name ?? '';
    const log = new Logger('exe');
    return async () => {
        const startedAt = new Date().getTime();
        const logDuration = () => {
            const duration = formatDuration(new Date().getTime() - startedAt);
            log.bare();
            log.info(`${bold(tag)} finished in ${bold(duration)}`);
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
            log.error(`Failed to run ${bold(tag)}`);
            throw e;
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
