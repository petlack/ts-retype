import { createCommand } from 'commander';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { generateTheme } from '@ts-retype/uikit';
import { execute } from './cmd';
import { isMain } from './isMain';
import { getRootDir } from './paths';

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
      'import { Theme } from "@ts-retype/uikit/src/types/theme";',
      `export const themes = ${JSON.stringify({ light, dark })} as { light: Theme, dark: Theme };`,
    ].join('\n'),
  );
}

if (isMain(import.meta)) {
  execute(program, generateThemes);
}
