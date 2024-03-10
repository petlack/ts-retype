import { access, constants, mkdir, readdir, readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { Logger } from '../logger.js';
import { fileURLToPath } from 'url';
import { shortError } from '../core.js';
import { statSync } from 'fs';

const log = new Logger('files');

/**
* Returns process working directory joined with the given path
*/
export const pwd = (p: string): string => join(process.cwd(), p);

/**
* Returns script directory joined with the given path
*/
export const dir = (p: string): string => join(getDirname(), p);

/**
* Returns the root directory of the project
*/
export async function getRootDir(): Promise<string | null> {
    let dir = getDirname();
    while (dir.length > 1 && !(await hasRootPackageJson(dir, 'ts-retype'))) {
        dir = dir.split('/').slice(0, -1).join('/');
    }
    if (dir.length < 2) {
        return null;
    }
    return dir;
}

/**
* Ensures that the given directory exists
*/
export async function ensureDirectoryExists(directory: string): Promise<void> {
    if (!(await fileExists(directory))) {
        await mkdir(directory, { recursive: true });
    }
}

/**
* Returns list of files in the given directory
*/
export async function listFiles(sourceDir: string) {
    const files = await readdir(sourceDir);
    return files.map((file) => join(sourceDir, file));
}

/**
* Returns the size of the given file in bytes
*/
export function getFileSizeInBytes(filePath: string): number | undefined {
    try {
        const stats = statSync(filePath);
        return stats.size;
    } catch (err: unknown) {
        // eslint-disable-next-line no-console
        log.error(`Failed to get file size for "${filePath}": ${shortError(err)}`);
        return undefined;
    }
}

/**
* Returns true if the file exists
*/
async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch (e: unknown) {
        return false;
    }
}


/**
* Returns the directory name of the current module
*/
function getDirname(): string {
    if (import.meta.url === undefined) {
        return __dirname;
    }
    const fileName = fileURLToPath(import.meta.url);
    return dirname(fileName);
}

/**
* Resolves to true if the given path has a package.json with the name "ts-retype"
*/
async function hasRootPackageJson(
    path: string,
    name: string,
): Promise<boolean> {
    const packageJsonPath = join(path, 'package.json');
    if (!(await fileExists(packageJsonPath))) {
        return false;
    }
    try {
        const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());
        return packageJson.name === name;
    } catch (e: unknown) {
        return false;
    }
}
