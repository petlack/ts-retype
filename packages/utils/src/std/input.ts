import { createInterface } from 'readline';
import { panic } from './panic.js';

/**
* Ask for confirmation with a given message.
*/
export async function confirm(
    message: string,
    { defaultYes = true }: { defaultYes?: boolean } = {},
) {
    const options = defaultYes ? '[Y/n]' : '[y/N]';
    const answer = await prompt(`${message} ${options} `);
    return answer.toLowerCase() === 'y';
}

/**
* Ask for confirmation with a given message.
*/
export function prompt(
    query: string,
): Promise<string> {
    if (!process.stdin.isTTY) {
        panic('Cannot prompt in non-interactive mode');
    }
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(
        query, ans => {
            rl.close();
            resolve(ans);
        }),
    );
}

/**
* Ask for confirmation with a given message.
* If the user does not confirm, the process is aborted.
*/
export async function ultimatum(
    message: string,
    { defaultYes = false }: { defaultYes?: boolean } = {},
) {
    if (!await confirm(message, { defaultYes })) {
        panic('Aborted');
    }
}
