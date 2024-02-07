import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { access, constants, mkdir, readdir, readFile } from 'fs/promises';

function getDirname(): string {
    if (import.meta.url === undefined) {
        return __dirname;
    }
    const fileName = fileURLToPath(import.meta.url);
    return dirname(fileName);
}

export const pwd = (p: string): string => join(process.cwd(), p);
export const dir = (p: string): string => join(getDirname(), p);

export async function hasRootPackageJson(path: string): Promise<boolean> {
    const packageJsonPath = join(path, 'package.json');
    if (!(await fileExists(packageJsonPath))) {
        return false;
    }
    const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());
    return packageJson.name === 'ts-retype';
}

export async function getRootDir(): Promise<string | null> {
    let dir = getDirname();
    while (dir.length > 1 && !(await hasRootPackageJson(dir))) {
        dir = dir.split('/').slice(0, -1).join('/');
    }
    if (dir.length < 2) {
        return null;
    }
    return dir;
}

export async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch (e: unknown) {
        return false;
    }
}

export async function ensureDirectoryExists(directory: string) {
    if (!(await fileExists(directory))) {
        await mkdir(directory, { recursive: true });
    }
}

export async function listFiles(sourceDir: string) {
    const files = await readdir(sourceDir);
    return files.map((file) => join(sourceDir, file));
}

export function getFileSizeInBytes(filePath: string): number | undefined {
    try {
        const stats = statSync(filePath);
        return stats.size;
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(`Failed to get file size for "${filePath}": ${err.message}`);
    }
}

export function readPackageJson(dirOrFilePath: string): {
    version: string;
    name: string;
    description: string;
    homepage: string;
    repository: { url: string };
} {
    const directory = dirOrFilePath.endsWith('package.json') ?
        dirname(dirOrFilePath) :
        dirOrFilePath;
    const filePath = join(directory, 'package.json');
    const contents = JSON.parse(readFileSync(filePath).toString());
    return {
        version: contents.version ?? 'unknown',
        name: contents.name ?? 'unknown',
        description: contents.description ?? 'unknown',
        homepage: contents.homepage ?? 'unknown',
        repository: { url: contents.repository?.url ?? 'unknown' },
    };
}
