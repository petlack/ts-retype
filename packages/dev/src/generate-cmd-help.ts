import { Logger, bold, formatSize } from '@ts-retype/utils';
import { createCommand } from 'commander';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';
import { join } from 'path';
import { spawn } from '@ts-retype/utils/std.js';
import { writeFile } from 'fs/promises';
import { ensureDirectoryExists } from './utils/paths.js';

const program = createCommand();
const log = new Logger('cmd');

program
    .name('generateCmdHelp')
    .description('Runs binary with -h flag and writes the output to a file.');

export async function generateCmdHelp(): Promise<void> {
    const root = (path: string) => join('..', '..', path);
    const bin = root('apps/bin/dist/release/bin/ts-retype.cjs');
    log.info(`Running ${bin} -h`);
    const { stdout } = await spawn(
        bin,
        ['-h'],
        { muteStdout: true },
    );
    await ensureDirectoryExists('apps/doc/src/generated/input');
    const target = root('apps/doc/src/generated/input/cmdHelp.txt');
    log.info(`Writing ${bold(formatSize(stdout.length))} to ${target}`);
    await writeFile(
        root('apps/doc/src/generated/input/cmdHelp.txt'),
        stdout,
    );
}

if (isMain()) {
    execute(program, generateCmdHelp);
}
