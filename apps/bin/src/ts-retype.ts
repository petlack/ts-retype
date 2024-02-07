#!/usr/bin/env node

import { Command, createCommand } from 'commander';
import { DEFAULT_CONFIG, TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types.js';
import { createLogger, readPackageJson, stringify } from '@ts-retype/utils';
import { readFileSync, writeFileSync } from 'fs';
import type { RetypeCmdProps } from '@ts-retype/search/types.js';
import { RetypeConfig } from '@ts-retype/search/config.js';
import { join } from 'path';
import { report } from '@ts-retype/search';
import { resolveOutputFilePath } from './cmd.js';

// eslint-disable-next-line no-console
const log = createLogger(console.log);

const pwd = (p: string) => join(process.cwd(), p);
const dir = (p: string) => join(__dirname, p);

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
    const { html, json } = report(config, { html: template });

    if (!config.noHtml && !config.output) {
        throw new Error('missing output');
    }

    if (!config.noHtml && html) {
        const htmlFile = resolveOutputFilePath(config.output);
        writeFileSync(htmlFile, html);
        log.log(`report exported to ${htmlFile}`);
        log.log('you can view it by running');
        log.log();
        log.log(`  open ${htmlFile}`);
        log.log();
    }

    if (config.json?.endsWith('.json') && json) {
        const jsonFile = config.json;
        writeFileSync(jsonFile, json);
        log.log(`json data exported to ${jsonFile}`);
        log.log();
    }
}

// if (isMain(import.meta)) {
if (require.main === module) {
    main();
}
