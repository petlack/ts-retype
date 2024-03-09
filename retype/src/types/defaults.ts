import { RetypeConfig } from '../config.js';
import { ScanProps, RetypeCmdProps } from './props.js';

export const DEFAULT_SCAN_PROPS: Partial<ScanProps> = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  rootDir: '.',
};

export const DEFAULT_CMD_PROPS: Partial<RetypeCmdProps> = {
  config: './.retyperc',
  exclude: ['**/node_modules/**', '**/dist/**'],
  init: false,
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
};

export const DEFAULT_CONFIG: RetypeConfig = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
  rootDir: '.',
};
