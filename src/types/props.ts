export type ScanArgs = {
  exclude: string[];
  include: string[];
  rootDir: string;
};

export type ReportArgs = {
  json: string | null;
  noHtml: boolean;
  output: string;
};

export type RetypeCmdOptions = ScanArgs &
  ReportArgs & {
    init: boolean;
    config: string;
  };

export const DEFAULT_ARGS: Partial<ScanArgs> = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  rootDir: '.',
};

export const DEFAULT_CMD_OPTIONS: Partial<RetypeCmdOptions> = {
  config: './.retyperc',
  exclude: ['**/node_modules/**', '**/dist/**'],
  init: false,
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
};
