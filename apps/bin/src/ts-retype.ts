#!/usr/bin/env node

import fs from 'fs';
import { Command, createCommand } from 'commander';
import { createLogger, dir, stringify, readPackageJson } from '@ts-retype/utils';
import { report } from '@ts-retype/search';
import { RetypeConfig } from '@ts-retype/search/config.js';
import { DEFAULT_CONFIG, TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types.js';
import type { RetypeCmdProps } from '@ts-retype/search/types.js';
// import { isMain } from '@ts-retype/scripts/src/isMain';

// TS_RETYPE_CMD_OPTIONS,
// report,
// scan

// eslint-disable-next-line no-console
const log = createLogger(console.log);

const { version, name, description } = readPackageJson(dir('.'));
const program = createCommand();

function buildProgram(command: Command) {
    for (const { short, long, args, desc } of TS_RETYPE_CMD_OPTIONS) {
        command.option(`-${short}, --${long} ${args || ''}`, desc);
    }
}

buildProgram(
    program
        .name(name)
        .description(description)
        .version(version)
);

function parseCmdProps(): Partial<RetypeCmdProps> {
    program.parse();
    const options = program.opts();
    const args = program.processedArgs;
    return {
        ...options,
        rootDir: args[0],
    };
}

function runGenerate(options: Partial<RetypeCmdProps>) {
    const configPath = typeof options.init === 'string' ? <string>options.init : '.retyperc';
    const config = stringify(DEFAULT_CONFIG);
    fs.writeFileSync(configPath, config);
    log.log(config);
    log.log(`written to ${configPath}`);
}

function main() {
    log.header();

    const cmdProps = parseCmdProps();

    log.log(JSON.stringify({ cmdProps }));

    if (cmdProps.init) {
        runGenerate(cmdProps);
        return;
    }

    if (!cmdProps.rootDir) {
    // throw new Error('missing rootDir');
        console.dir({ cmdProps });
        process.exit(1);
    }

    const config = RetypeConfig.fromCmdProps(cmdProps);

    report(config);
}

// if (isMain(import.meta)) {
if (require.main === module) {
    main();
}
