import { readFileSync, statSync } from 'fs';
import path from 'path';

// const __dirname = path.join(path.dirname(new URL(import.meta.url).pathname), '..');

export function readPackageJson(dirOrFilePath: string): {
    version: string;
    name: string;
    description: string;
    homepage: string;
    repository: { url: string };
} {
    const directory = dirOrFilePath.endsWith('package.json') ?
        path.dirname(dirOrFilePath) :
        dirOrFilePath;
    const filePath = path.join(directory, 'package.json');
    const contents = JSON.parse(readFileSync(filePath).toString());
    return {
        version: contents.version ?? 'unknown',
        name: contents.name ?? 'unknown',
        description: contents.description ?? 'unknown',
        homepage: contents.homepage ?? 'unknown',
        repository: { url: contents.repository?.url ?? 'unknown' },
    };
}

export const pwd = (p: string) => path.join(process.cwd(), p);
export const dir = (p: string) => path.join(__dirname, p);

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

export function filterEmpty<T extends object>(obj: T): Partial<T> {
    return <Partial<T>>Object.fromEntries(Object.entries(obj).filter(([, v]) => !!v));
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

type Freq = { [k in string | number | symbol]: number };

export function freq(list: (string | number | symbol)[]) {
    const map = list.reduce((res, item) => {
        res[item] = (res[item] || 0) + 1;
        return res;
    }, <Freq>{});
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

export function getFileSizeInBytes(filePath: string): number | undefined {
    try {
        const stats = statSync(filePath);
        return stats.size;
    } catch (err: any) {
        console.error(`Failed to get file size for "${filePath}": ${err.message}`);
    }
}
