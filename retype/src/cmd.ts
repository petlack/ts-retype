import fs from 'fs';
import path from 'path';
import { filterEmpty, pwd } from './utils.js';

export function resolveConfig<T extends object>(
  configFile: string | undefined | null,
  defaults: T,
): Partial<T> {
  if (!configFile) {
    return defaults;
  }
  const configFileData = <T>JSON.parse(fs.readFileSync(configFile).toString());
  return {
    ...defaults,
    ...filterEmpty(configFileData),
  };
}

export function resolveOptions<O extends object>(
  options: Partial<O>,
  defaults: O,
  defaultConfig: string,
): O {
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
  } else {
    htmlFile = configOutput;
    const parentDir = path.dirname(htmlFile);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  }
  return htmlFile;
}
