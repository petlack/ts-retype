#!/usr/bin/env node

import fs from 'fs';
import { createCommand } from 'commander';

import { dir, stringify } from './utils';
import { createLogger } from './log';
import { report } from './report';
import { RetypeCmdProps } from './types';
import { DEFAULT_CONFIG, RetypeConfig } from './config';

const log = createLogger(console.log);

const { version, name, description } = JSON.parse(
  fs.readFileSync(dir('./package.json')).toString(),
);
const program = createCommand();

program
  .name(name)
  .description(description)
  .version(version)
  .argument('<path-to-project>', 'path to project')
  .option(
    '-c, --config [path]',
    'load config - if no path provided, loads .retyperc from current directory. if not set, use default config',
  )
  .option('-e, --exclude [glob...]', 'glob patterns that will be ignored')
  .option(
    '-g, --init [file-path]',
    'initializes with default config. if no path is provided, creates .retyperc in the current directory',
  )
  .option('-i, --include [glob...]', 'glob patterns that will be included in search')
  .option(
    '-j, --json <file-path>',
    'file path to export JSON report. if not set, does not export JSON.',
  )
  .option('-n, --noHtml', 'if set, does not export HTML', false)
  .option(
    '-o, --output <file-path|dir-path>',
    'HTML report file path - if provided with dir, create index.html file inside the dir',
    './retype-report.html',
  );

function parseOptions(): Partial<RetypeCmdProps> {
  program.parse();
  const options = program.opts();
  const args = program.processedArgs;
  return {
    ...options,
    rootDir: args[0],
    config: options.config
      ? typeof options.config === 'string'
        ? options.config
        : '.retyperc'
      : undefined,
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

  const options = parseOptions();

  log.log(JSON.stringify(options));

  if (options.init) {
    runGenerate(options);
    return;
  }

  if (!options.rootDir) {
    throw new Error('missing rootDir');
  }

  const args = RetypeConfig.fromCmdProps(options);

  report(args);
}

if (require.main === module) {
  main();
}
