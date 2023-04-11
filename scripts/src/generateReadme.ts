import { createCommand } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execute, executeCommand } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('generateReadme').description('generateReadme program');

async function generateReadme(config: Partial<CmdProps>) {
  console.log(config);
  const helpCmdTxt = await executeCommand('../dist/ts-retype.cjs -h');
  writeFileSync('../docs/src/snippets/cmdHelp.txt', helpCmdTxt);
  const contents = readFileSync(join('..', 'README.template.md')).toString();
  const readme = contents
    .split('\n')
    .map((line) => {
      if (line.startsWith('@import')) {
        const path = line.replace('@import ', '');
        return readFileSync(join('..', path));
      }
      return line;
    })
    .join('\n');
  writeFileSync('../README.md', readme);
}

if (isMain(import.meta)) {
  execute(program, generateReadme);
}
