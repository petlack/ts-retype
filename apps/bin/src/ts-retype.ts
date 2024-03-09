#!/usr/bin/env node

import { Command, createCommand } from 'commander';
import { DEFAULT_CONFIG, TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types.js';
import { HTML_TEMPLATE, PROJECT_INFO, hasConstants } from './constants.js';
import {
    Logger,
    bold,
    panic,
    readPackageJson,
    stringify,
    stripColors,
} from '@ts-retype/utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { RetypeCmdProps } from '@ts-retype/search/types.js';
import { RetypeConfig } from '@ts-retype/search';
import { join } from 'path';
import { report } from '@ts-retype/search';
import { resolveOutputFilePath } from './cmd.js';

const log = new Logger('main');
const program = createCommand();

function main() {
    const { version, name, description } = readProjectInfo();
    buildProgram(
        program
            .name(name)
            .description(description)
            .version(version)
    );
    const cmdProps = parseCmdProps();

    header();
    log.debug('CMD Props', cmdProps);

    if (cmdProps.init) {
        runGenerate(cmdProps);
        return;
    }

    if (!cmdProps.rootDir) throw new Error('Missing rootDir');

    const config = RetypeConfig.fromCmdProps(cmdProps);
    log.debug('Config', config);

    if (!config.noHtml && !config.output) throw new Error('Missing output');

    config.rootDir = pwd(config.rootDir);
    const template = readHtmlTemplate();
    const { html, json } = report(config, { html: template });
    const saveHtml = !config.noHtml && html;
    const saveJson = config.json?.endsWith('.json') && json;

    if (saveHtml) {
        const htmlFile = resolveOutputFilePath(config.output);
        writeFileSync(htmlFile, html);
        log.info(bold('• HTML Report exported to'));
        log.info(' ', bold(htmlFile));
        log.info(' ', 'You can view it by running');
        log.info(' ', `  open ${htmlFile}`);
        if (saveJson) log.bare();
    }

    if (config.json && saveJson) {
        writeFileSync(config.json, json);
        log.info(bold('• JSON data exported to'));
        log.info(' ', bold(config.json));
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
    const configPath = typeof options.init === 'string' ?
        <string>options.init :
        '.retyperc';
    const config = stringify(DEFAULT_CONFIG);
    writeFileSync(configPath, config);
    log.info(config);
    log.info(`Written to ${configPath}`);
}


function header(width = 50) {
    const pkg = readProjectInfo();
    log.info(fill(width, '='));
    log.info(row(width, bold(pad(pkg.name))));
    log.info(row(width, pad(`v${pkg.version}`)));
    log.info(fill(width, '='));
    log.bare();
    log.info('Docs:   ', pkg.docs);
    log.info('GitHub: ', pkg.repo.replace('git+', ''));
    log.bare();

}

function readHtmlTemplate() {
    if (hasConstants()) {
        log.info('Using embedded HTML template');
        return HTML_TEMPLATE;
    }
    const distPath = dir('vis/index.html');
    log.info('Loading HTML template from', distPath);
    return readFileSync(distPath).toString();
}

function readProjectInfo() {
    if (hasConstants()) {
        log.info('Using embedded project info');
        return PROJECT_INFO;
    }
    const pkgFile = dir('package.json');
    log.info('Loading project info from', pkgFile);
    if (!existsSync(pkgFile)) {
        panic('No package.json found');
    }
    const pkg = readPackageJson(pkgFile);
    return {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        docs: pkg.homepage,
        repo: pkg.repository?.url,
    };
}

const pwd = (p: string) => join(process.cwd(), p);
const dir = (p: string) => join(__dirname, p);

const safeLength = (msg: string) => stripColors(msg).length;
const fill = (width: number, ch: string) => ''.padEnd(width, ch);
const pad = (msg: string) => (safeLength(msg) % 2 === 1 ? `${msg} ` : msg);
const center = (width: number, msg: string) => fill((width - safeLength(msg)) / 2, ' ');
const row = (width: number, msg: string) => [
    '= ',
    center(width - 4, msg),
    msg,
    center(width - 4, msg),
    ' =',
].join('');

// if (isMain(import.meta)) {
if (require.main === module) {
    main();
}
