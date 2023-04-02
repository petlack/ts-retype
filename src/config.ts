import fs from 'fs';
import { omit } from 'ramda';
import { ReportArgs, RetypeCmdOptions, ScanArgs } from './types';

export const DEFAULT_CONFIG: RetypeConfig = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
  rootDir: '.',
};

export type RetypeConfig = ScanArgs & ReportArgs;

export function loadConfig(path: string) {
  const configFileData = <Partial<RetypeConfig>>JSON.parse(fs.readFileSync(path).toString());
  return configFileData;
}

function fromConfigFile(file: string): Partial<RetypeConfig> {
  return loadConfig(file);
}

function fromCmd(options: Partial<RetypeCmdOptions>): RetypeConfig {
  const configFile = options.config
    ? fromConfigFile(options.config)
    : ({} as Partial<RetypeConfig>);

  return {
    ...DEFAULT_CONFIG,
    ...configFile,
    ...omit(['config'], options),
  };
}

function fromArgs(args: Partial<ScanArgs>): RetypeConfig {
  return {
    ...DEFAULT_CONFIG,
    ...args,
  };
}

export interface IRetypeConfig {
  fromCmd(options: Partial<RetypeCmdOptions>): RetypeConfig;
  fromConfigFile(file: string): Partial<RetypeConfig>;
  fromArgs(args: Partial<ScanArgs>): RetypeConfig;
}

export const RetypeConfig: IRetypeConfig = {
  fromCmd,
  fromConfigFile,
  fromArgs,
};
