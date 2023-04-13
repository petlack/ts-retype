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
