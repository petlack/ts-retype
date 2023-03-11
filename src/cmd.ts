import fs from 'fs';
import path from 'path';
import { dir, filterEmpty, pwd } from './utils';


export function createLogger() {
  return {
    header() {
      const pkg = JSON.parse(fs.readFileSync(dir('./package.json')).toString());
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

export function resolveConfig<T extends object>(configFile: string | undefined | null, defaults: T): Partial<T> {
  if (!configFile) {
    return defaults;
  }
  const configFileData = <T>JSON.parse(fs.readFileSync(configFile).toString());
  return {
    ...defaults,
    ...filterEmpty(configFileData),
  };
}

export function resolveOptions<O extends object>(options: Partial<O>, defaults: O, defaultConfig: string): O {
  let config: Partial<O> = defaults;
  if ('config' in options) {
    const configOption = (<{ config: boolean | string | null | undefined }>options).config;
    let configFile = pwd(defaultConfig);
    if (typeof configOption === 'string') {
      configFile = <string>configOption;
    }
    config = resolveConfig(configFile, defaults);
  }
  return {
    ...defaults,
    ...config,
    ...filterEmpty(options),
  };
}

export function resolveOutputFilePath(configOutput: string): string {
  let htmlFile = configOutput;
  let isDir = false;
  if (!fs.existsSync(configOutput)) {
    if (!configOutput.endsWith('.html')) {
      isDir = true;
    }
  } else {
    if (fs.lstatSync(configOutput).isDirectory()) {
      isDir = true;
    }
  }
  if (isDir) {
    htmlFile = path.join(configOutput, 'index.html');
    if (!fs.existsSync(configOutput)) {
      fs.mkdirSync(configOutput, { recursive: true });
    }
  }
  else {
    htmlFile = configOutput;
    const parentDir = path.dirname(htmlFile);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  }
  return htmlFile;
}