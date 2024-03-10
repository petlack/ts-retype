import {
    existsSync,
    readFileSync,
    writeFileSync,
} from 'fs';
import { createCommand } from 'commander';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';
import { join } from 'path';
import { Logger, bold, formatSize } from '@ts-retype/utils';

const log = new Logger('readme');

export async function generateReadme(
    options: { verbose?: boolean },
) {
    const rootPath = join('..', '..');
    const readmeFile = join(rootPath, 'README.template.md');
    if (!existsSync(readmeFile)) {
        throw new Error(`File not found: ${readmeFile}`);
    }
    const contents = readFileSync(readmeFile).toString();
    const readme = contents
        .split('\n')
        .map((line, idx) => {
            if (line.startsWith('@import')) {
                const path = line.replace('@import ', '');
                const content = readFileSync(join(rootPath, path));
                if (options.verbose) {
                    log.info(`${idx}: Imported ${bold(formatSize(content.length))} chars from ${path}`);
                }
                return content;
            }
            return line;
        })
        .join('\n');
    writeFileSync(join(rootPath, 'README.md'), readme);
}

if (isMain()) {
    execute(
        createCommand()
            .name('generateReadme')
            .description('generateReadme program'),
        generateReadme,
    );
}
