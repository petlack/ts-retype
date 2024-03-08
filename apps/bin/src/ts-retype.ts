#!/usr/bin/env node

import { Command, createCommand } from 'commander';
import { DEFAULT_CONFIG, TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types.js';
import { bold, readPackageJson, stringify } from '@ts-retype/utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Logger } from '@ts-retype/utils';
import { RetypeCmdProps } from '@ts-retype/search/types.js';
import { RetypeConfig } from '@ts-retype/search';
import { join } from 'path';
import { report } from '@ts-retype/search';
import { resolveOutputFilePath } from './cmd.js';

const log = new Logger('bin');
const program = createCommand();

function main() {
    const { version, name, description } = readPackageJson(dir('.'));
    buildProgram(
        program
            .name(name)
            .description(description)
            .version(version)
    );

    header();

    const cmdProps = parseCmdProps();

    log.info(JSON.stringify({ cmdProps }));

    if (cmdProps.init) {
        runGenerate(cmdProps);
        return;
    }

    if (!cmdProps.rootDir) {
        throw new Error('Missing rootDir');
    }

    const config = RetypeConfig.fromCmdProps(cmdProps);

    log.info('Config', config);

    config.rootDir = pwd(config.rootDir);

    const template = readFileSync(dir('vis/index.html')).toString();
    const { html, json } = report(config, { html: template });

    if (!config.noHtml && !config.output) {
        throw new Error('Missing output');
    }

    if (!config.noHtml && html) {
        const htmlFile = resolveOutputFilePath(config.output);
        writeFileSync(htmlFile, html);
        log.info(`Report exported to ${htmlFile}`);
        log.info('You can view it by running');
        log.info(bold(`open ${htmlFile}`));
    }

    if (config.json?.endsWith('.json') && json) {
        const jsonFile = config.json;
        writeFileSync(jsonFile, json);
        log.info(`JSON data exported to ${jsonFile}`);
    }

    log.bare();
    log.ok('Done');
}

function buildProgram(command: Command) {
    for (const { short, long, args, desc } of TS_RETYPE_CMD_OPTIONS) {
        command.option(`-${short}, --${long} ${args || ''}`, desc);
    }
    command.arguments('[rootDir]');
}

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
    log.info(config);
    log.info(`written to ${configPath}`);
}


function header(width = 50) {
    const pkgFile = findPackageJSON();
    if (!pkgFile) {
        log.info(fill(width, '='));
        log.info(row(width, pad('No package.json found')));
        return;
    }

    const pkg = readPackageJson(pkgFile);
    log.info(fill(width, '='));
    log.info(row(width, pad(pkg.name)));
    log.info(row(width, pad(`v${pkg.version}`)));
    log.info(fill(width, '='));
    log.bare();
    log.info('docs: ', pkg.homepage);
    log.info('github: ', pkg.repository.url.replace('git+', ''));
    log.bare();

}

function findPackageJSON(): string | null {
    const distPath = dir('./package.json');
    if (existsSync(distPath)) {
        return distPath;
    }
    return null;
}

const pwd = (p: string) => join(process.cwd(), p);
const dir = (p: string) => join(__dirname, p);

const fill = (width: number, ch: string) => ''.padEnd(width, ch);
const pad = (msg: string) => (msg.length % 2 === 1 ? `${msg} ` : msg);
const center = (width: number, msg: string) => fill((width - msg.length) / 2, ' ');
const row = (width: number, msg: string) =>
    `= ${center(width - 4, msg)}${msg}${center(width - 4, msg)} =`;

// if (isMain(import.meta)) {
if (require.main === module) {
    main();
}
