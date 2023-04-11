import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process';

export function stripExt(name: string) {
  const extension = path.extname(name);
  if (!extension) {
    return name;
  }

  return name.slice(0, -extension.length);
}

export function isMain(meta: ImportMeta) {
  if (!meta || !process.argv[1]) {
    return false;
  }

  const require = createRequire(meta.url);
  const scriptPath = require.resolve(process.argv[1]);

  const modulePath = fileURLToPath(meta.url);

  const extension = path.extname(scriptPath);
  if (extension) {
    return modulePath === scriptPath;
  }

  return stripExt(modulePath) === scriptPath;
}
