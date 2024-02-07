import { dirname, join } from 'path';
import { readFileSync, existsSync, lstatSync, mkdirSync } from 'fs';
import { filterEmpty } from '@ts-retype/utils';

const pwd = (p: string) => join(process.cwd(), p);

export function resolveConfig<T extends object>(
    configFile: string | undefined | null,
    defaults: T,
): Partial<T> {
    if (!configFile) {
        return defaults;
    }
    const configFileData = <T>JSON.parse(readFileSync(configFile).toString());
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
    if (!existsSync(configOutput)) {
        if (!configOutput.endsWith('.html')) {
            isDir = true;
        }
    } else {
        if (lstatSync(configOutput).isDirectory()) {
            isDir = true;
        }
    }
    if (isDir) {
        htmlFile = join(configOutput, 'index.html');
        if (!existsSync(configOutput)) {
            mkdirSync(configOutput, { recursive: true });
        }
    } else {
        htmlFile = configOutput;
        const parentDir = dirname(htmlFile);
        if (!existsSync(parentDir)) {
            mkdirSync(parentDir, { recursive: true });
        }
    }
    return htmlFile;
}
