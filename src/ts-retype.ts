#!/usr/bin/env node

import fs from 'fs';
import { dir, stringify } from './utils';
import { createCommand } from 'commander';
import { createLogger } from './log';
import { report } from './report';
import { RetypeConfig } from './config';
import { RetypeCmdProps, DEFAULT_CONFIG } from './types';

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
  .option('-n, --noHtml', 'if set, does not export HTML')
  .option(
    '-o, --output <file-path|dir-path>',
    'HTML report file path - if provided with dir, create index.html file inside the dir',
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
    throw new Error('missing rootDir');
  }

  const config = RetypeConfig.fromCmdProps(cmdProps);

  report(config);
}

if (require.main === module) {
  main();
}
