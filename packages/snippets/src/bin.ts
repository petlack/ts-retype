#!/usr/bin/env node

import { execute, getRootDir } from '@ts-retype/utils';
import { createCommand } from 'commander';
import { extractSnippets } from './extract.js';
import { join } from 'path';
import { syntaxHighlighting } from './highlight.js';
import { ensureDirectoryExists } from '@ts-retype/utils/index.js';

const program = createCommand();

program
    .name('extractSnippets')
    .description('extract snippets from source files to destination files');


async function main() {
    const rootDir = await getRootDir();
    if (!rootDir) {
        throw new Error('rootDir not found');
    }

    const tmpDir = join(rootDir, 'apps/doc/src/generated/input');
    const output = join(rootDir, 'apps/doc/src/generated');

    await ensureDirectoryExists(tmpDir);

    await extractSnippets({
        rootDir,
        output: tmpDir,
    });
    return syntaxHighlighting({
        dir: tmpDir,
        output,
    });
}

execute(main);
