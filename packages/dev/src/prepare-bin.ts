import { join } from 'path';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';
import { getRootDir } from './utils/paths.js';
import { createCommand } from 'commander';
import { Logger, bold } from '@ts-retype/utils/index.js';

const log = new Logger('bin');

export async function prepareBin() {
    const rootDir = await getRootDir();
    log.info(`Root dir: ${rootDir}`);
    if (!rootDir) {
        return;
    }
    const distRoot = join(rootDir, 'apps', 'bin', 'dist');
    const packageJson = JSON.parse(
        (await readFile(join(rootDir, 'apps', 'bin', 'package.json'))).toString(),
    );

    if ('private' in packageJson) {
        packageJson.private = false;
    }

    delete packageJson.devDependencies;
    delete packageJson.exports;
    delete packageJson.husky;
    delete packageJson['lint-staged'];
    delete packageJson.nx;
    delete packageJson.scripts;

    packageJson.bin['ts-retype'] = packageJson.bin['ts-retype'].replace('dist/', '');
    packageJson.main = packageJson.main.replace('dist/', '');

    packageJson.name = 'ts-retype';

    const distPackageJson = JSON.stringify(packageJson, null, 2) + '\n';

    log.info(`Preparing bin for ${bold(packageJson.name)} v${packageJson.version}`);

    await writeFile(
        `${distRoot}/package.json`,
        distPackageJson,
    );

    await copyFile(
        `${rootDir}/README.md`,
        `${distRoot}/README.md`,
    );
    await copyFile(
        `${rootDir}/LICENSE.md`,
        `${distRoot}/LICENSE.md`,
    );

    await copyFile(
        `${rootDir}/apps/vis/dist/index.html`,
        `${distRoot}/index.html`,
    );

    const visHtmlFile = `${distRoot}/index.html`;
    await fillConstants(
        `${distRoot}/ts-retype.cjs`,
        {
            TS_RETYPE_REPORT_HTML_TEMPLATE: await readFile(visHtmlFile),
            TS_RETYPE_PROJECT_NAME: packageJson.name,
            TS_RETYPE_PROJECT_DESCRIPTION: packageJson.description,
            TS_RETYPE_PROJECT_VERSION: packageJson.version,
            TS_RETYPE_PROJECT_DOCS: packageJson.homepage,
            TS_RETYPE_PROJECT_REPO: packageJson.repository?.url,
        },
    );
}

async function fillConstants(path: string, constants: Record<string, string | Buffer>) {
    const contents = await readFile(path);
    const replaced = Object.entries(constants).reduce(
        (acc, [key, value]) => acc.replace(key, value?.toString()),
        contents.toString(),
    );
    await writeFile(path, replaced);
}

if (isMain()) {
    execute(
        createCommand()
            .name('prepareBin')
            .description('Inserts compiled constants into the ts-retype binary'),
        prepareBin);
}
