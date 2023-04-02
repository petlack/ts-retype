import fs from 'fs';
import readline from 'readline';
import { dir } from './utils';

export function createLogger(logFn: (...args: unknown[]) => void) {
  return {
    header() {
      const pkg = JSON.parse(fs.readFileSync(dir('./package.json')).toString());
      const width = 50;
      const fill = (width: number, ch: string) => ''.padEnd(width, ch);

      const pad = (msg: string) => (msg.length % 2 === 1 ? `${msg} ` : msg);
      const center = (width: number, msg: string) => fill((width - msg.length) / 2, ' ');
      const row = (msg: string) => `= ${center(width - 4, msg)}${msg}${center(width - 4, msg)} =`;

      logFn(fill(width, '='));
      logFn(row(pad(pkg.name)));
      logFn(row(pad(`v${pkg.version}`)));
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
