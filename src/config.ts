import fs from 'fs';
import { omit } from 'ramda';
import { ReportProps, RetypeCmdProps, ScanProps } from './types';

export const DEFAULT_CONFIG: RetypeConfig = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
  rootDir: '.',
};

export type RetypeConfig = ScanProps & ReportProps;

export function loadConfig(path: string) {
  const configFileData = <Partial<RetypeConfig>>JSON.parse(fs.readFileSync(path).toString());
  return configFileData;
}

function fromConfigFile(file: string): Partial<RetypeConfig> {
  return loadConfig(file);
}

function fromCmdProps(options: Partial<RetypeCmdProps>): RetypeConfig {
  const configFile = options.config
    ? fromConfigFile(options.config)
    : ({} as Partial<RetypeConfig>);

  return {
    ...DEFAULT_CONFIG,
    ...configFile,
    ...omit(['config'], options),
  };
}

function fromScanProps(args: Partial<ScanProps>): RetypeConfig {
  return {
    ...DEFAULT_CONFIG,
    ...args,
  };
}

export interface IRetypeConfig {
  fromCmdProps(options: Partial<RetypeCmdProps>): RetypeConfig;
  fromConfigFile(file: string): Partial<RetypeConfig>;
  fromScanProps(args: Partial<ScanProps>): RetypeConfig;
}

export const RetypeConfig: IRetypeConfig = {
  fromCmdProps,
  fromConfigFile,
  fromScanProps,
};
