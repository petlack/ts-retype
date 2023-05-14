#!/usr/bin/env node

import fs from 'fs';
import { dir, stringify } from './utils.js';
import { Command, createCommand } from 'commander';
import { createLogger } from './log.js';
import { report } from './report.js';
import { RetypeConfig } from './config.js';
import { RetypeCmdProps, DEFAULT_CONFIG } from './types/index.js';
import { TS_RETYPE_CMD_OPTIONS } from './types/props.js';
// import { isMain } from '@ts-retype/scripts/src/isMain';

const log = createLogger(console.log);

const { version, name, description } = JSON.parse(
  fs.readFileSync(dir('./package.json')).toString(),
);
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
    .argument('<path-to-project>', 'path to project'),
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

// if (isMain(import.meta)) {
if (require.main === module) {
  main();
}
