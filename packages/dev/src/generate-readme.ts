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

// type CmdProps = { verbose: boolean };

const program = createCommand();
const log = new Logger('readme');

program.name('generateReadme').description('generateReadme program');

export async function generateReadme() {
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
                log.info(`${idx}: Imported ${bold(formatSize(content.length))} chars from ${path}`);
                return content;
            }
            return line;
        })
        .join('\n');
    writeFileSync(join(rootPath, 'README.md'), readme);
}

if (isMain()) {
    execute(program, generateReadme);
}
