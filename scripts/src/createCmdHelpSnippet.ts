import { createCommand } from 'commander';
import { writeFile } from 'fs/promises';
import { execute } from './cmd.js';
import { exec } from './exec.js';
import { isMain } from './isMain.js';

const program = createCommand();

program.name('generateReadme').description('generateReadme program');

export async function createCmdHelpSnippet() {
  const { stdout } = await exec('../retype/dist/ts-retype.cjs', ['-h'], { muteStdout: true });
  await writeFile('../docs/src/snippets/cmdHelp.txt', stdout);
}

if (isMain(import.meta)) {
  execute(program, createCmdHelpSnippet);
}
