import { Logger, bold } from '@ts-retype/utils/index.js';
import { panic, ultimatum } from '@ts-retype/utils/std.js';
import { createCommand } from 'commander';
import { exec } from 'child_process';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';
import { join } from 'path';
import packageJson from '../../../apps/bin/package.json';
import { writeFileSync } from 'fs';

const log = new Logger('bump');

type Level = |
    'info' |
    'dev' |
    'rc' |
    'patch' |
    'minor' |
    'major' |
    'release';

type Version = {
    major: number;
    minor: number;
    patch: number;
    rc?: number | null;
    level?: Level;
};

export async function bump(
    options: {
        level?: Level,
        verbose?: boolean,
    },
) {
    const distRoot = join(__dirname, '../../../apps/bin');

    // const level = process.argv[2] as (Level | undefined);
    const level = options.level ?? 'info';
    const version = packageJson.version;

    if (options.verbose) {
        log.info('Options:', options);
    }

    if (level === 'info') {
        log.info(`Current version v${version}`);
        return;
    }

    const modified = await checkGit();
    if (modified.length > 0) {
        log.error(
            'There are currently unstaged changes.',
            '\n',
            modified.join('\n'),
        );
        panic('Aborting');
    }

    const oldVersion = version;
    const newVersion = increaseVersion(version, level);

    log.info(`${oldVersion} - [${level}] -> ${newVersion} `);

    // await ultimatum(`bump to ${newVersion} ? Y/n`);

    packageJson.version = newVersion;

    const distPackageJson = JSON.stringify(packageJson, null, 4) + '\n';

    log.info(`Writing ${distRoot}/package.json`);
    writeFileSync(`${distRoot}/package.json`, distPackageJson);

    await ultimatum('run pnpm i ?');
    log.info(`Running ${bold('pnpm i')}`);
    await execAsync('pnpm i');

    const commitMsg = `chore(bin): bump v${oldVersion} -> v${newVersion}`;
    log.info('Commit message:', '\n', commitMsg);

    const gitCommands = [
        'git add .',
        `git commit -m "${commitMsg}"`,
        `git tag -a v${newVersion} -m "v${newVersion}"`,
        `git push github v${newVersion}`,
    ];
    log.info('Git Commands:', gitCommands);
    await ultimatum('Run git commands?');
    for (const cmd of gitCommands) {
        await execAsync(cmd);
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
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
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
            .option('-l, --level <level>', 'Level of the bump - dev, rc, patch, minor, major, release'),
        bump
    );
}
