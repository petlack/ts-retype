export { formatDuration } from './time.js';

/**
* Filter out empty values from an object
*/
export function filterEmpty<T extends object>(
    obj: T,
): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => !!v)
    ) as Partial<T>;
}

/**
* Returns stringified JSON of the given argument
*/
export function formatJson(
    args: object,
    tabsize = 2,
) {
    const keys = Object.keys(args);
    if (keys.length === 1) {
        const key = keys[0];
        const value = JSON.stringify(
            (args as Record<string, unknown>)[key]
        );
        return `{ "${key}": ${value} }`;
    }
    return JSON.stringify(
        args,
        (_key, value) =>
            Array.isArray(value) ?
                `[${value.map((v) => '"' + v + '"').join(',')}]` :
                value,
        tabsize,
    )
        .replace(/"\[/g, '[')
        .replace(/\]"/g, ']')
        .replace(/\\"/g, '"');
}

/**
* Format the given size in bytes to a human readable string
*/
export function formatSize(
    size: number,
): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
* Calculate the frequency of each item in a list
* @returns An array of objects with a name and count property
*/
export function freq(
    list: (string | number | symbol)[],
): { name: string, count: number }[] {
    const map = list.reduce((res, item) => {
        res[item] = (res[item] || 0) + 1;
        return res;
    }, <{ [k in string | number | symbol]: number }>{});
    return Object.entries(map).map(([name, count]) => ({ name, count }));
}

/**
* Function to get the terminal width if the environment is interactive
*/
export function getTerminalDims(): [number, number] | undefined {
    if (isInteractive()) {
        return [
            process.stdout.columns,
            process.stdout.rows,
        ];
    }
    return undefined;
}
/**
* Returns true if the process is running in an interactive terminal
* false if it is running in a non-interactive terminal (e.g. CI)
*/
function isInteractive(): boolean {
    return process.stdout.isTTY === true;
}

/**
* Split the given string into lines
*/
export function lines(
    str: string | undefined | null,
): string[] {
    if (!str) return [];
    return str.replace('\r\n', '\n').split('\n');
}

/**
* Round the given number to the given number of decimal places
*/
export function round(
    x: number,
    decimals: number,
): number {
    return Math.round(x * 10 ** decimals) / 10 ** decimals;
}

/**
* Returns an subarray of the given array with the given indices
*/
export function selectIndices<T>(
    arr: T[],
    indices: Iterable<number>,
): T[] {
    const result: T[] = [];
    for (const index of indices) {
        if (index >= 0 && index < arr.length) {
            result.push(arr[index]);
        }
    }
    return result;
}

/**
* Returns string representation of the given argument
*/
export function stringify(
    arg: unknown,
): string {
    if (arg == null) return String(arg);
    switch (typeof arg) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
    case 'undefined':
        return String(arg);
    case 'function':
        return `[Function: ${arg.name}]`;
    case 'object':
        if (arg instanceof Date) {
            return arg.toISOString();
        }
        if (Array.isArray(arg)) {
            return JSON.stringify(arg);
        }
        return formatJson(arg, 4);
    }
    return String(arg);
}
