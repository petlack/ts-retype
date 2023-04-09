export type ScanProps = {
  exclude: string[];
  include: string[];
  rootDir: string;
};

export type ReportProps = {
  json: string | null;
  noHtml: boolean;
  output: string;
};

export type RetypeCmdProps = ScanProps &
  ReportProps & {
    init: boolean;
    config: string;
  };

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
