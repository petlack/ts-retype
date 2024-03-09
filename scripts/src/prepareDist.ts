import { join } from 'path';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { run } from './cmd.js';
import { isMain } from './isMain.js';
import { getRootDir } from './paths.js';

export async function prepareDist() {
  const rootDir = await getRootDir();
  if (!rootDir) {
    return;
  }
  const distRoot = `${rootDir}/retype/dist`;
  const packageJson = JSON.parse(
    (await readFile(join(rootDir, 'retype', 'package.json'))).toString(),
  );

  if ('private' in packageJson) {
    packageJson.private = false;
  }

  delete packageJson.scripts;
  if ('exports' in packageJson) {
    delete packageJson.exports;
  }
  delete packageJson.husky;
  delete packageJson['lint-staged'];

  packageJson.bin['ts-retype'] = packageJson.bin['ts-retype'].replace('dist/', '');
  // packageJson.type = 'module';

  packageJson.name = 'ts-retype';

  const distPackageJson = JSON.stringify(packageJson, null, 2) + '\n';

  await writeFile(`${distRoot}/package.json`, distPackageJson, {});

  await copyFile(`${rootDir}/README.md`, `${distRoot}/README.md`);
  await copyFile(`${rootDir}/LICENSE.md`, `${distRoot}/LICENSE.md`);

  await copyFile(`${rootDir}/vis/dist/index.html`, `${distRoot}/index.html`);
}

if (isMain(import.meta)) {
  run(prepareDist);
}
