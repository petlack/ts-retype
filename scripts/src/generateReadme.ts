import { createCommand } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { executeCommand, run } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('generateReadme').description('generateReadme program');

function parseCmdProps(): Partial<CmdProps> {
  program.parse();
  const options = program.opts();
  return options;
}

async function generateReadme(config: Partial<CmdProps>) {
  console.log(config);
  const helpCmdTxt = await executeCommand('../dist/ts-retype.cjs -h');
  writeFileSync('../docs/src/snippets/cmdHelp.txt', helpCmdTxt);
  const contents = readFileSync(join('..', 'README.template.md')).toString();
  const lines = contents
    .split('\n')
    .map((line) => {
      if (line.startsWith('@import')) {
        const path = line.replace('@import ', '');
        return readFileSync(join('..', path));
      }
      return line;
    })
    .join('\n');
  return lines;
}

async function main() {
  const config = parseCmdProps();
  if (config.verbose) {
    console.log(config);
  }

  try {
    const readme = await generateReadme(config);
    writeFileSync('../README.md', readme);
  } catch (e: any) {
    console.log(e.message);
    program.outputHelp();
    process.exit(1);
  }

  console.log('done');
}

if (isMain(import.meta)) {
  run(main);
}
