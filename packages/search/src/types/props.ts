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

export const TS_RETYPE_CMD_OPTIONS = [
    {
        short: 'c',
        long: 'config',
        args: '[file-path]',
        desc: 'load config - if no path provided, loads .retyperc from current directory. if not set, use default config',
    },
    { short: 'e', long: 'exclude', args: '[glob...]', desc: 'glob patterns that will be ignored' },
    {
        short: 'g',
        long: 'init',
        args: '[file-path]',
        desc: 'initializes with default config. if no path is provided, creates .retyperc in the current directory',
    },
    {
        short: 'i',
        long: 'include',
        args: '[glob...]',
        desc: 'glob patterns that will be included in search',
    },
    {
        short: 'j',
        long: 'json',
        args: '<file-path>',
        desc: 'file path to export JSON report to. if not set, does not export JSON.',
    },
    { short: 'n', long: 'noHtml', desc: 'if set, does not export HTML' },
    {
        short: 'o',
        long: 'output',
        args: '<file-path|dir-path>',
        desc: 'HTML report file path - if provided with dir, create index.html file inside the dir',
    },
];
