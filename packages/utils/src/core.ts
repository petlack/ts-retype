export function filterEmpty<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => !!v)
    ) as Partial<T>;
}

export function formatDuration(ms: number) {
    let sec = ms / 1000;
    if (sec < 60) {
        return `${sec.toFixed(2)}s`;
    }
    let min = Math.floor(sec / 60);
    sec -= min * 60;
    if (min < 60) {
        return `${min}m ${sec.toFixed(2)}s`;
    }
    const hours = Math.floor(min / 60);
    min -= hours * 60;
    return `${hours}h ${min}m ${sec.toFixed(2)}`;
}

export function freq(list: (string | number | symbol)[]) {
    const map = list.reduce((res, item) => {
        res[item] = (res[item] || 0) + 1;
        return res;
    }, <{ [k in string | number | symbol]: number }>{});
    return Object.entries(map).map(([name, count]) => ({ name, count }));
}

export function selectIndices<T>(arr: T[], indices: Iterable<number>): T[] {
    const result: T[] = [];
    for (const index of indices) {
        if (index >= 0 && index < arr.length) {
            result.push(arr[index]);
        }
    }
    return result;
}

export const stringify = (args: unknown) =>
    JSON.stringify(
        args,
        (_key, value) =>
            Array.isArray(value) ? `[${value.map((v) => '"' + v + '"').join(',')}]` : value,
        2,
    )
        .replace(/"\[/g, '[')
        .replace(/\]"/g, ']')
        .replace(/\\"/g, '"');

export function lines(str: string | undefined | null): string[] {
    if (!str) return [];
    return str.replace('\r\n', '\n').split('\n');
}

export function round(x: number, decimals: number): number {
    return Math.round(x * 10 ** decimals) / 10 ** decimals;
}
