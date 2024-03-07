import readline from 'readline';

type Color = 'red' | 'purple' | 'white' | 'green' | 'blue' | 'red' | 'yellow' | 'dimmed';
const BOX_PADDING = 7;

const BG_BLUE = '44';
const BG_DIMMED = '100';
const BG_GREEN = '42';
const BG_PURPLE = '45';
const BG_RED = '41';
const BG_WHITE = '47';
const BG_YELLOW = '43';

const FG_BLACK = '30';
const FG_BLUE = '34';
const FG_DIMMED = '90';
const FG_GREEN = '32';
const FG_PURPLE = '35';
const FG_RED = '31';
const FG_WHITE = '37';
const FG_YELLOW = '33';

const isColorsEnabled = () => process.env.COLORS === 'true' || +(process.env.COLORS ?? 0) === 1;

/**
 * Enables color output globally
 */
export function enableColors(): void {
    process.env.COLORS = '1';
}

/**
 * Disables color output globally
 */
export function disableColors(): void {
    process.env.COLORS = undefined;
}

/**
* Strips color codes from the input string.
*/
export function stripColors(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1b\[\d+m/g, '');
}

const withCode = (code: string, text: string): string => isColorsEnabled() ? `\x1b[${code}m${text}\x1b[0m` : text;

/**
 * Formats the text with a background color.
 * @param text - The text to format.
 * @returns The formatted text.
 */
export const blueBg = (text: string): string => withCode(BG_BLUE, text);
export const dimmedBg = (text: string): string => withCode(BG_DIMMED, text);
export const greenBg = (text: string): string => withCode(BG_GREEN, text);
export const purpleBg = (text: string): string => withCode(BG_PURPLE, text);
export const redBg = (text: string): string => withCode(BG_RED, text);
export const whiteBg = (text: string): string => withCode(BG_WHITE, text);
export const yellowBg = (text: string): string => withCode(BG_YELLOW, text);

/**
 * Formats the text with a foreground color.
 * @param text - The text to format.
 * @returns The formatted text.
 */
export const blackFg = (text: string): string => withCode(FG_BLACK, text);
export const dimmedFg = (text: string): string => withCode(FG_DIMMED, text);
export const greenFg = (text: string): string => withCode(FG_GREEN, text);
export const redFg = (text: string): string => withCode(FG_RED, text);
export const whiteFg = (text: string): string => withCode(FG_WHITE, text);
export const yellowFg = (text: string): string => withCode(FG_YELLOW, text);

/**
 * Formats the text as bold.
 * @param text - The text to format.
 * @returns The formatted text.
 */
export const bold = (text: string): string => isColorsEnabled() ? `\x1b[1m${text}\x1b[0m` : text;

/**
 * Formats the text as dimmed.
 * @param text - The text to format.
 * @returns The formatted text.
 */
export const dim = (text: string): string => dimmedFg(text);

/**
 * Starts color output with given text color. Any text printed to console after this call will be colored.
 * @param color - color of the text
 */
export const startFg = (color: Color): void => {
    if (!isColorsEnabled()) return;
    const fg = {
        black: FG_BLACK,
        blue: FG_BLUE,
        dimmed: FG_DIMMED,
        green: FG_GREEN,
        purple: FG_PURPLE,
        red: FG_RED,
        white: FG_WHITE,
        yellow: FG_YELLOW,
    }[color];
    if (!fg) return;
    process.stdout.write(`\x1b[${fg}m`);
};

/**
 * Resets all colors
 */
export const resetColors = (): void => { 
    if (isColorsEnabled()) {
        process.stdout.write('\x1b[0m');
    }
};

/**
* Formats colorful error message
*/
export function error(...msgs: unknown[]): string {
    return `${box('red', 'ERROR', BOX_PADDING)} ${redFg(msgs.join(' '))}`;
}

/**
 * Formats an info message.
 */
export function info(...msgs: unknown[]): string {
    return `${box('white', 'INFO', BOX_PADDING)} ${msgs.join(' ')}`;
}

/**
 * Formats a warning message.
 * @param msgs - The message(s) to log.
 */
export function warn(...msgs: unknown[]): string {
    return `${box('yellow', 'WARN', BOX_PADDING)} ${msgs.join(' ')}`;
}

/**
 * Formats a success message.
 */
export function ok(...msgs: unknown[]): string {
    return `${box('green', 'OK', BOX_PADDING)} ${msgs.join(' ')}`;
}

/**
 * Creates a box with colored background around the provided text.
 * @param color - The background color of the box.
 * @param text - The text to be enclosed in the box.
 * @param [width=-1] - The width of the box (optional, default is the length of `text`).
 * @returns The string representing the box.
 */
export function box(color: Color, text: string, width = -1): string {
    const str = text || '';
    const bg = {
        red: redBg,
        blue: blueBg,
        white: whiteBg,
        green: greenBg,
        purple: purpleBg,
        yellow: yellowBg,
        dimmed: dimmedBg,
    }[color];
    const padL = 1;
    const padR = width > 0 ? Math.max(1, width - str.length + 1) : 1;
    const padLeft = ' '.repeat(padL);
    const padRight = ' '.repeat(padR);
    return blackFg(bg(`${padLeft}${str}${padRight}`));
}

/**
 * Prompts the user with a confirmation question and resolves with a boolean indicating the user's response.
 * Reads only first character of the user input and is case insensitive.
 * @param question - The question to prompt the user.
 * @param [defaultAnswer='n'] - The default answer if the user inputs nothing (optional, default is 'n').
 * @returns {Promise<boolean>} A promise that resolves with `true` if the user confirms, and `false` otherwise.
 */
export function confirm(
    question: string,
    defaultAnswer = 'n',
): Promise<boolean> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const yes = defaultAnswer === 'y' ? 'Y' : 'y';
        const no = defaultAnswer === 'n' ? 'N' : 'n';
        rl.question(`${question} [${yes}/${no}] `, (input) => {
            let answer = input.trim().toLowerCase();
            if (!answer.length) answer = defaultAnswer;
            if (answer.at(0) === 'y') {
                resolve(true);
            } else {
                resolve(false);
            }
            rl.close();
        });
    });
}

/**
 * Logs an error message with a red "PANIC" label and 
 * exits the process with an optional return code.
 */
export function panic(msg: string, returnCode = 1): never {
    // eslint-disable-next-line no-console
    console.error(box('red', 'PANIC'), redFg(msg));
    process.exit(returnCode);
}
