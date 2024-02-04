#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { Command, createCommand } from 'commander';
import { createLogger, dir, stringify, readPackageJson, pwd } from '@ts-retype/utils';
import { report } from '@ts-retype/search';
import { RetypeConfig } from '@ts-retype/search/config.js';
import { DEFAULT_CONFIG, TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types.js';
import type { RetypeCmdProps } from '@ts-retype/search/types.js';
import { resolveOutputFilePath } from './cmd.js';
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
    command.arguments('[rootDir]');
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
    writeFileSync(configPath, config);
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
        throw new Error('missing rootDir');
    }

    const config = RetypeConfig.fromCmdProps(cmdProps);

    log.log(JSON.stringify({ config }));

    config.rootDir = pwd(config.rootDir);

    const template = readFileSync(dir('vis/index.html')).toString();
    const content = report(config, template);

    if (!config.noHtml && !config.output) {
        throw new Error('missing output');
    }

    if (!config.noHtml) {
        const htmlFile = resolveOutputFilePath(config.output);
        writeFileSync(htmlFile, content);
        log.log(`report exported to ${htmlFile}`);
        log.log('you can view it by running');
        log.log();
        log.log(`  open ${htmlFile}`);
        log.log();
    }

    if (config.json?.endsWith('.json')) {
        writeFileSync(config.json, content);
        log.log(`json data exported to ${config.json}`);
        log.log();
    }

}

// if (isMain(import.meta)) {
if (require.main === module) {
    main();
}
