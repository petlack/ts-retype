import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { omit } from 'ramda';
import { DEFAULT_CONFIG, ReportProps, RetypeCmdProps, ScanProps } from './types.js';

export type RetypeConfig = ScanProps & ReportProps;

export interface IRetypeConfig {
  fromCmdProps(cmdProps: Partial<RetypeCmdProps>): RetypeConfig;
  fromConfigFile(file: string): Partial<RetypeConfig> | null;
  fromScanProps(scanProps: Partial<ScanProps>): RetypeConfig;
}

export const RetypeConfig: IRetypeConfig = {
    fromCmdProps,
    fromConfigFile,
    fromScanProps,
};

export function loadConfig(path: string): Partial<RetypeConfig> | null {
    if (existsSync(path)) {
        const configFileData = <Partial<RetypeConfig>>JSON.parse(readFileSync(path).toString());
        return configFileData;
    }
    return null;
}

export function fromConfigFile(file: string): Partial<RetypeConfig> | null {
    return loadConfig(file);
}

export function fromCmdProps(cmdProps: Partial<RetypeCmdProps>): RetypeConfig {
    const configFromCmd = cmdProps.config ? loadConfig(cmdProps.config) : null;
    const configFromRetyperc = cmdProps.rootDir
        ? loadConfig(join(cmdProps.rootDir, '.retyperc'))
        : null;

    const config = configFromCmd || configFromRetyperc || ({} as Partial<RetypeConfig>);

    return {
        ...DEFAULT_CONFIG,
        ...config,
        ...omit(['config'], cmdProps),
    };
}

export function fromScanProps(scanProps: Partial<ScanProps>): RetypeConfig {
    return {
        ...DEFAULT_CONFIG,
        ...scanProps,
    };
}
