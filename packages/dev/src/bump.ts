import { CmdOptions, execute } from './utils/cmd.js';
import { Logger, bold } from '@ts-retype/utils/index.js';
import { panic, ultimatum } from '@ts-retype/utils/std.js';
import { readFileSync, writeFileSync } from 'fs';
import { createCommand } from 'commander';
import { exec } from 'child_process';
import { isMain } from './utils/is-main.js';
import { join } from 'path';

const log = new Logger('bump');

type Level = 'info' | 'dev' | 'rc' | 'patch' | 'minor' | 'major' | 'release';
type Version = {
    major: number;
    minor: number;
    patch: number;
    rc?: number | null;
    level?: Level;
};

export async function bump(
    options: CmdOptions & {
    app: string,
    ignoreWorkspaceChanges?: boolean,
    level?: Level,
    remote?: string,
    verbose?: boolean,
}) {
    const {
        app,
        ignoreWorkspaceChanges = true,
        level = 'info',
        remote = 'github',
        verbose,
    } = options;

    if (!app) panic('App name is required, but missing');

    const distRootRelative = join('apps', app);
    const distRoot = join(__dirname, '../../..', distRootRelative);
    const packageJson = JSON.parse(
        readFileSync(`${distRoot}/package.json`, 'utf-8')
    );
    const version = packageJson.version;

    if (!version) panic('No version found in package.json');

    if (verbose) {
        log.info('Options:', options);
    }

    if (level === 'info') {
        log.info(`Current version v${version}`);
        return;
    }

    const modified = await checkGit();
    if (modified.length > 0) {
        log.error(
            'There are currently unstaged changes.\n',
            modified.join('\n'),
        );
        if (!ignoreWorkspaceChanges) {
            panic('Aborting');
        }
    }

    const oldVersion = version;
    const newVersion = increaseVersion(version, level);

    log.info(`${oldVersion} - [${level}] -> ${newVersion} `);

    if (!options.noconfirm) await ultimatum(`Bump to ${newVersion}?`);

    packageJson.version = newVersion;

    const distPackageJson = JSON.stringify(packageJson, null, 4) + '\n';

    log.info(`Writing ${distRoot}/package.json`);
    writeFileSync(`${distRoot}/package.json`, distPackageJson);

    if (!options.noconfirm) await ultimatum('run pnpm i ?');
    log.info(`Running ${bold('pnpm i')}`);
    await execAsync('pnpm i');

    const updated = await checkGit();
    if (updated.length > 0) {
        log.info('Changed\n', updated.join('\n'));
    }

    const tag = `${app}/v${newVersion}`;
    const commitMsg = `bump(${app}): release ${level} v${oldVersion} -> v${newVersion}`;
    const gitCommands = [
        `git add ${distRootRelative}/package.json`,
        `git commit -m "${commitMsg}"`,
        `git tag -a ${tag} -m "${app} v${newVersion}"`,
        `git push ${remote} ${tag}`,
    ];

    log.info('Commit message:', '\n', commitMsg);
    log.info(`Tagging as ${bold(tag)} on ${remote}`);
    log.info('Git Commands:', gitCommands);

    if (!options.noconfirm) await ultimatum('Run git commands?');
    for (const cmd of gitCommands) {
        log.debug(`Running ${bold(cmd)}`);
        const output = await execAsync(cmd);
        log.debug(output);
    }
}

function parse(version: string) {
    const [main, rcFull] = version.split('-');
    const [major, minor, patch] = main.split('.').map(x => +x);
    let rc = null;
    if (rcFull) {
        rc = +rcFull.split('.')[1];
    }
    return { major, minor, patch, rc };
}

function format(ver: Version | string, level: Level = 'rc') {
    if (typeof ver === 'string') {
        return ver;
    }
    return `${ver.major}.${ver.minor}.${ver.patch}${ver.rc ? `-${level}.${ver.rc}` : ''}`;
}

function increaseVersion(version: string, levelExpr: Level) {
    const { major, minor, patch, rc } = parse(version);
  
    const level = levelExpr[0] === '-' || levelExpr[0] === '+' ? levelExpr.slice(1) : levelExpr;
    const inc = levelExpr[0] === '-' ? -1 : 1;
  
    let newVersion: Version | string = { major, minor, patch, rc };
    switch(level) {
    case 'dev':
    case 'rc':
        newVersion = { major, minor, patch, rc: (rc || 0) + inc };
        break;
    case 'patch':
        newVersion = { major, minor, patch: patch + inc, rc: null };
        break;
    case 'minor':
        newVersion = { major, minor: minor + inc, patch: 0, rc: null };
        break;
    case 'major':
        newVersion = { major: major + inc, minor: 0, patch: 0, rc: null };
        break;
    case 'release':
        newVersion = { major, minor, patch, rc: null };
        break;
    default:
        newVersion = version;
    }

    return format(newVersion, levelExpr);
}

function execAsync(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: '../../' }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                log.warn(`Command ${bold(cmd)} generated stderr:`);
                log.warn(stderr);
            }
            resolve(stdout);
        });
    });
}

async function checkGit() {
    const res = await execAsync('git diff-index HEAD');
    const lines = res.split('\n')
        .map(line => line.trim())
        .filter(x => x.length)
        .map(x => x.split(' ').slice(4).join(' '));
    return lines;
}

if (isMain()) {
    execute(
        createCommand()
            .name('bump')
            .description('Bump version of the bin package.')
            // .argument('<pkg>', 'Name of the package - one of bin, vis, doc, utils, ...')
            .option(
                '-l, --level <level>',
                'Level of the bump - dev, rc, patch, minor, major, release',
            )
            .option(
                '--app <app>',
                'Name of the app - one of bin, vis, doc',
            ),
        bump,
        { noConfirm: true }
    );
}
