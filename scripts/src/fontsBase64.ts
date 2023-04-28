import { createCommand } from 'commander';
import { join, parse, extname } from 'path';
import { writeFile } from 'fs/promises';
import { execute } from './cmd.js';
import { isMain } from './isMain.js';
import { getRootDir, listFiles } from './paths.js';
import { exec } from './exec.js';
import { zip } from 'ramda';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('fontBase64').description('fontBase64 program').version('1.0.0');

async function fontFileToBase64(path: string, { rootDir }: { rootDir: string }): Promise<string> {
  const runCmd = ['run', '--rm', '-v', `${path}:/app/font`, 'encode-font'];
  const { stdout, stderr } = await exec('docker', runCmd, {
    cwd: join(rootDir, 'scripts'),
    muteStdout: true,
    muteStderr: true,
  });
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout;
}

async function fontBase64(config: Partial<CmdProps>) {
  const rootDir = await getRootDir();
  if (!rootDir) {
    // eslint-disable-next-line no-console
    console.error('Could not finds rootDir');
    throw new Error('Could not finds rootDir');
  }

  const fontsDir = join(rootDir, 'vis/assets/fonts');
  const fontsMapTargetPath = join(rootDir, 'vis/assets/fonts-map.json');
  const fonts = await listFiles(fontsDir);
  const encodedFonts = await Promise.all(fonts.map((font) => fontFileToBase64(font, { rootDir })));
  const fontsMap = zip(fonts, encodedFonts).map(([font, encoded]) => [
    parse(font).name,
    extname(font).slice(1),
    encoded,
  ]);
  await writeFile(fontsMapTargetPath, JSON.stringify(fontsMap, null, 2));
}

if (isMain(import.meta)) {
  execute(program, fontBase64);
}
