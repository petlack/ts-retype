import { bold, box, green, red } from '../colors.js';
import { longError, shortError } from '../core.js';
import { Logger } from '../logger.js';

const log = new Logger('cli');

/**
 * Logs an error message with a red "PANIC" label and 
 * exits the process with an optional return code.
 */
export function panic(msg: unknown, returnCode = 1): never {
    // eslint-disable-next-line no-console
    console.error(msg);
    log.error(red(longError(msg)));
    log.error(
        box('red', 'PANIC'),
        bold(red(shortError(msg))),
    );
    process.exit(returnCode);
}

/**
 * Logs a success message with a green "OK" label and
 * exits the process with an optional status code (default 0)
 */
export function success(msg?: string, returnCode = 0): never {
    // eslint-disable-next-line no-console
    log.ok(
        box('green', 'OK'),
        msg == null ? '' : bold(green(msg)),
    );
    process.exit(returnCode);
}
