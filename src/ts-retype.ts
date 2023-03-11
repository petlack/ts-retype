#!/usr/bin/env node

import fs from 'fs';
import { createCommand } from 'commander';

import { createLogger, resolveOptions, resolveOutputFilePath } from './cmd';
import { createTypeClusters } from './clusters';
import { DEFAULT_OPTIONS, RetypeOptions } from './types';
import { dir, stringify } from './utils';

const log = createLogger();

const { version, name, description } = JSON.parse(fs.readFileSync(dir('./package.json')).toString());
const program = createCommand();

program.name(name)
  .description(description)
  .version(version)
  .argument('<path-to-project>', 'path to project')
  .option('-c, --config [path]', 'load config - if no path provided, loads .retyperc from current directory. if not set, use default config')
  .option('-o, --output <file-path|dir-path>', 'HTML report file path - if provided with directory, it will create index.html file inside', './retype-report.html')
  .option('-j, --json <file-path>', 'JSON report file path. if not set, does not export JSON.')
  .option('-i, --include [glob...]', 'glob patterns that will be included in search')
  .option('-x, --exclude [glob...]', 'glob patterns that will be ignored');

function parseOptions(): Partial<RetypeOptions> {
  program.parse();
  const options = program.opts();
  const args = program.processedArgs;
  return {
    project: args[0],
    ...options,
  };
}

function main() {
  const options = parseOptions();
  const project = options.project;

  if (!project) {
    throw new Error('missing project');
  }

  log.header();

  const args = {
    project,
    ...resolveOptions(options, DEFAULT_OPTIONS, '.retyperc'),
  };
  
  log.log('running with config');
  log.log(stringify(args));
  log.log();

  log.log(`discovering duplicates in ${project}`);

  const clusters = createTypeClusters(args);

  log.log();
  for (const cluster of clusters) {
    log.log(`- ${cluster.clusters.length} instances of ${cluster.name}`);
  }

  const data = JSON.stringify(clusters);

  const htmlFile = resolveOutputFilePath(args.output);

  fs.cpSync(dir('./vis/dist/index.html'), htmlFile);

  const html = fs.readFileSync(htmlFile);
  const replaced = html
    .toString()
    .replace('window.__datajson__="DATA_JSON"', `window.__data__ = ${data}`);
  fs.writeFileSync(htmlFile, replaced);

  log.log();
  log.log(`report exported to ${htmlFile}`);
  log.log('you can view it by running');
  log.log();
  log.log(`  open ${htmlFile}`);
  log.log();

  if (args.json) {
    fs.writeFileSync(args.json, data);
    log.log(`json data exported to ${args.json}`);
    log.log();
  }
}

if (require.main === module) {
  main();
}
