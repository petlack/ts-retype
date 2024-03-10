import { join } from 'path';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';
import { ensureDirectoryExists, getRootDir } from './utils/paths.js';
import { createCommand } from 'commander';
import { Logger, bold, formatSize } from '@ts-retype/utils/index.js';

const log = new Logger('bin');

export async function prepareBin() {
    const rootDir = await getRootDir();
    log.info(`Root dir:    ${rootDir}`);
    if (!rootDir) {
        return;
    }
    const distRoot = join(rootDir, 'apps', 'bin', 'dist');
    const releaseRoot = join(distRoot, 'release');
    log.info(`Dist dir:    ${distRoot}`);
    log.info(`Release dir: ${releaseRoot}\n`);

    await ensureDirectoryExists(releaseRoot);

    const packageJson = JSON.parse(
        (await readFile(join(rootDir, 'apps', 'bin', 'package.json'))).toString(),
    );

    if ('private' in packageJson) {
        packageJson.private = false;
    }

    delete packageJson.devDependencies;
    delete packageJson.dependencies;
    delete packageJson.exports;
    delete packageJson.husky;
    delete packageJson['lint-staged'];
    delete packageJson.nx;
    delete packageJson.scripts;

    packageJson.bin['ts-retype'] = packageJson.bin['ts-retype'].replace('dist/', '');
    packageJson.main = packageJson.main.replace('dist/', '');
    packageJson.types = packageJson.types.replace('dist/', '');

    packageJson.name = 'ts-retype';

    const distPackageJson = JSON.stringify(packageJson, null, 2) + '\n';

    log.info(`Preparing bin for ${bold(packageJson.name)} v${packageJson.version}`);

    const filesToCopy = [
        'ts-retype.cjs',
        'index.d.cts',
        'index.cjs',
        'index.cjs.map',
    ];
    for (const file of filesToCopy) {
        log.info(`Copying from dist ${file}`);
        await copyFile(
            `${distRoot}/${file}`,
            `${releaseRoot}/${file}`,
        );
    }
    const rootFilesToCopy = [
        'README.md',
        'LICENSE.md',
    ];
    for (const file of rootFilesToCopy) {
        log.info(`Copying from root ${file}`);
        await copyFile(
            `${rootDir}/${file}`,
            `${releaseRoot}/${file}`,
        );
    }

    log.info('Writing package.json');
    await writeFile(
        `${releaseRoot}/package.json`,
        distPackageJson,
    );

    const visHtmlFile = join(rootDir, 'apps', 'vis', 'dist', 'index.html');
    const visHtmlContents = await readFile(visHtmlFile);
    const escapedVisHtmlContents = escapeHTMLContentForJS(
        visHtmlContents.toString().trim()
    );
    log.info(`Replacing constants in ${releaseRoot}/ts-retype.cjs`);
    await fillConstants(
        `${releaseRoot}/ts-retype.cjs`,
        {
            TS_RETYPE_REPORT_HTML_TEMPLATE: escapedVisHtmlContents,
            TS_RETYPE_PROJECT_NAME: packageJson.name,
            TS_RETYPE_PROJECT_DESCRIPTION: packageJson.description,
            TS_RETYPE_PROJECT_VERSION: packageJson.version,
            TS_RETYPE_PROJECT_DOCS: packageJson.homepage,
            TS_RETYPE_PROJECT_REPO: packageJson.repository?.url,
        },
    );
}

async function fillConstants(path: string, constants: Record<string, string | Buffer>) {
    const buffer = await readFile(path);
    const contents = buffer.toString();
    const replaced = Object.entries(constants).reduce(
        (acc, [key, value]) => {
            const str = value?.toString() ?? '';
            if (key === 'TS_RETYPE_REPORT_HTML_TEMPLATE') {
                const [before, after] = acc.split(key);
                const repl = [before, value, after].join('');
                // const repl = acc.replace(key, str);
                return repl;
            }
            log.info(`Written ${bold(formatSize(str.length))} to ${key}`);
            return acc.replace(key, str);

        },
        contents,
    );
    await writeFile(path, replaced);
}

function escapeHTMLContentForJS(htmlContent: string): string {
    return htmlContent
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\\'')
        .replace(/"/g, '\\"')
        .replace(/`/g, '\\`')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

//
if (isMain()) {
    execute(
        createCommand()
            .name('prepareBin')
            .description('Inserts compiled constants into the ts-retype binary'),
        prepareBin);
}
