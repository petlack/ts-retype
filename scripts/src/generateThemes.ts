import { createCommand } from 'commander';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { generateTheme } from '@ts-retype/uikit/generate';
import { execute } from './cmd.js';
import { isMain } from './isMain.js';
import { getRootDir } from './paths.js';

const program = createCommand();

program.name('generateThemes').description('generate static themes for vis');

export async function generateThemes() {
  const accent = '#0a799e';
  const second = '#c68726';
  const body = "'Noto Sans', sans-serif";
  const heading = "'Exo 2', sans-serif";
  const mono = "'Fira Code', monospace";

  const light = generateTheme({ accent, body, heading, mono, second, mode: 'light' });
  const dark = generateTheme({ accent, body, heading, mono, second, mode: 'dark' });

  const rootDir = await getRootDir();

  if (!rootDir) {
    console.log('Could not find rootDir');
    return;
  }

  await writeFile(
    join(rootDir, 'vis/src/themes.ts'),
    [
      'import { Theme } from "@ts-retype/uikit";',
      `export const themes = ${JSON.stringify({ light, dark })} as { light: Theme, dark: Theme };`,
    ].join('\n'),
  );
}

if (isMain(import.meta)) {
  execute(program, generateThemes);
}
