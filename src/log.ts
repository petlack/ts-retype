import fs from 'fs';
import readline from 'readline';
import { dir } from './utils';

function findPackageJSON() {
  const distPath = dir('./package.json');
  const srcPath = dir('../package.json');
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  if (fs.existsSync(srcPath)) {
    return srcPath;
  }
}

const fill = (width: number, ch: string) => ''.padEnd(width, ch);
const pad = (msg: string) => (msg.length % 2 === 1 ? `${msg} ` : msg);
const center = (width: number, msg: string) => fill((width - msg.length) / 2, ' ');
const row = (width: number, msg: string) =>
  `= ${center(width - 4, msg)}${msg}${center(width - 4, msg)} =`;

export function createLogger(logFn: (...args: unknown[]) => void) {
  const width = 50;
  return {
    header() {
      const pkgFile = findPackageJSON();
      if (!pkgFile) {
        logFn(fill(width, '='));
        logFn(row(width, pad('No package.json found')));
        return;
      }

      const pkg = JSON.parse(fs.readFileSync(pkgFile).toString());
      logFn(fill(width, '='));
      logFn(row(width, pad(pkg.name)));
      logFn(row(width, pad(`v${pkg.version}`)));
      logFn(fill(width, '='));
      logFn();
      logFn('docs: ', pkg.homepage);
      logFn('github: ', pkg.repository.url.replace('git+', ''));
      logFn();
    },
    log(...msg: unknown[]) {
      logFn(...msg);
    },
    live(msg: string, newline = false) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(msg);
      if (newline) {
        process.stdout.write('\n');
      }
    },
  };
}