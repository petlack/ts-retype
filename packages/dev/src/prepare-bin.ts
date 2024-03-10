import { join } from 'path';
import { cp, copyFile, readFile, writeFile } from 'fs/promises';
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
    const binDistRoot = join(rootDir, 'apps', 'bin', 'dist');
    const searchDistRoot = join(rootDir, 'packages', 'search', 'dist');
    const releaseRoot = join(binDistRoot, 'release');
    const releaseRootBin = join(releaseRoot, 'bin');
    const releaseRootDist = join(releaseRoot, 'dist');
    log.info(`Dist dir:    ${binDistRoot}`);
    log.info(`Release dir: ${releaseRoot}\n`);

    await ensureDirectoryExists(releaseRootBin);
    await ensureDirectoryExists(releaseRootDist);

    const binPackageJson = JSON.parse(
        (await readFile(join(rootDir, 'apps', 'bin', 'package.json'))).toString(),
    );
    const searchPackageJson = JSON.parse(
        (await readFile(join(rootDir, 'packages', 'search', 'package.json'))).toString(),
    );

    if ('private' in binPackageJson) {
        binPackageJson.private = false;
    }

    delete binPackageJson.devDependencies;
    delete binPackageJson.dependencies;
    delete binPackageJson.exports;
    delete binPackageJson.husky;
    delete binPackageJson['lint-staged'];
    delete binPackageJson.nx;
    delete binPackageJson.scripts;

    binPackageJson.bin['ts-retype'] = binPackageJson.bin['ts-retype'].replace('dist/', 'bin/');
    binPackageJson.main = searchPackageJson.main;
    binPackageJson.types = searchPackageJson.types;
    binPackageJson.exports = searchPackageJson.exports;
    binPackageJson.dependencies = Object.fromEntries(
        Object.entries(searchPackageJson.dependencies)
            .filter(([key]) => !key.startsWith('@ts-retype'))
    );

    binPackageJson.name = 'ts-retype';

    const distPackageJson = JSON.stringify(binPackageJson, null, 2) + '\n';

    log.info(`Preparing bin for ${bold(binPackageJson.name)} v${binPackageJson.version}`);

    const binFilesToCopy = [
        'ts-retype.cjs',
    ];
    for (const file of binFilesToCopy) {
        log.info(`Copying from bin dist ${file}`);
        await copyFile(
            join(binDistRoot, file),
            join(releaseRootBin, file),
        );
    }

    log.info('Copying from search dist to bin dist');
    await cp(searchDistRoot, releaseRootDist, { recursive: true });

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

    log.info(`Replacing constants in ${releaseRootBin}/ts-retype.cjs`);
    await fillConstants(
        join(releaseRootBin, 'ts-retype.cjs'),
        {
            TS_RETYPE_REPORT_HTML_TEMPLATE: escapedVisHtmlContents,
            TS_RETYPE_PROJECT_NAME: binPackageJson.name,
            TS_RETYPE_PROJECT_DESCRIPTION: binPackageJson.description,
            TS_RETYPE_PROJECT_VERSION: binPackageJson.version,
            TS_RETYPE_PROJECT_DOCS: binPackageJson.homepage,
            TS_RETYPE_PROJECT_REPO: binPackageJson.repository?.url,
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

if (isMain()) {
    execute(
        createCommand()
            .name('prepareBin')
            .description('Inserts compiled constants into the ts-retype binary'),
        prepareBin);
}
