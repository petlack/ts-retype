import fs from 'fs';
import { dir } from './utils';

const pkg = JSON.parse(fs.readFileSync(dir('./package.json')).toString());

export function createLogger() {
  return {
    header() {
      const width = 50;
      const fill = (width: number, ch: string) => ''.padEnd(width, ch);

      const pad = (msg: string) => msg.length % 2 === 1 ? `${msg} ` : msg;
      const center = (width: number, msg: string) => fill((width-msg.length)/2,' ');
      const row = (msg: string) => `= ${center(width - 4, msg)}${msg}${center(width - 4, msg)} =`;

      console.log(fill(width, '='));
      console.log(row(pad(pkg.name)));
      console.log(row(pad(`v${pkg.version}`)));
      console.log(fill(width, '='));
      console.log();
      console.log('docs: ', pkg.homepage);
      console.log('github: ', pkg.repository.url.replace('git+', ''));
      console.log();
    },
    log(...msg: unknown[]) {
      console.log(...msg);
    },
    live(msg: string) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(msg);
    }
  };
}