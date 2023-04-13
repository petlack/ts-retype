import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { access, constants, mkdir, readdir, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function hasRootPackageJson(path: string): Promise<boolean> {
  const packageJsonPath = join(path, 'package.json');
  if (!(await fileExists(packageJsonPath))) {
    return false;
  }
  const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());
  return packageJson.name === 'ts-retype';
}

export async function getRootDir(): Promise<string | null> {
  let dir = __dirname;
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
