import { writeFile } from 'fs/promises';
import { exec } from './exec.js';

export async function createCmdHelpSnippet() {
  const { stdout } = await exec('../dist/ts-retype.cjs', ['-h'], { muteStdout: true });
  await writeFile('../docs/src/snippets/cmdHelp.txt', stdout);
}
