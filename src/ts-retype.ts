#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createCommand } from 'commander';

import { createTypeClusters } from '../src/clusters';
import { DEFAULT_OPTIONS, RetypeConfig, RetypeOptions } from './types';

const pwd = (p: string) => path.join(process.cwd(), p);
const dir = (p: string) => path.join(__dirname, p);

const { version, name, description } = JSON.parse(fs.readFileSync(dir('./package.json')).toString());
const program = createCommand();

program.name(name)
  .description(description)
  .version(version)
  .argument('<path-to-project>', 'path to project')
  .option('-c, --config [path]', 'load config - if no path provided, loads .retyperc from current directory. if not set, use default config')
  .option('-o, --output <file-path|dir-path>', 'output file name - if provided with directory, it will create index.html file inside', './retype-report.html')
  .option('-i, --include [glob...]', 'glob patterns that will be included in search')
  .option('-x, --exclude [glob...]', 'glob patterns that will be ignored');

function parseOptions(defaultOptions: RetypeConfig): RetypeOptions {
  program.parse();
  const options = program.opts();
  const args = program.processedArgs;
  return {
    project: args[0],
    ...defaultOptions,
    ...options,
  };
}

function resolveConfig(configOption: boolean | string | undefined): RetypeConfig {
  if (!configOption) {
    return DEFAULT_OPTIONS;
  }
  let configFile = pwd('.retyperc');
  if (typeof configOption === 'string') {
    configFile = configOption;
  }
  const configFileData = <RetypeConfig>JSON.parse(fs.readFileSync(configFile).toString());
  return {
    ...DEFAULT_OPTIONS,
    ...configFileData,
  };
}

function resolveOutputFilePath(configOutput: string): string {
  let htmlFile = configOutput;
  let isDir = false;
  if (!fs.existsSync(configOutput)) {
    if (!configOutput.endsWith('.html')) {
      isDir = true;
    }
  } else {
    if (fs.lstatSync(configOutput).isDirectory()) {
      isDir = true;
    }
  }
  if (isDir) {
    htmlFile = path.join(configOutput, 'index.html');
    if (!fs.existsSync(configOutput)) {
      fs.mkdirSync(configOutput, { recursive: true });
    }
  }
  else {
    htmlFile = configOutput;
    const parentDir = path.dirname(htmlFile);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  }
  return htmlFile;
}

function main() {
  const options = parseOptions(DEFAULT_OPTIONS);
  const project = options.project;
  const config = resolveConfig(options.config);

  console.log(`searching for duplicates in ${project}`);

  const args = {
    ...config,
    ...options,
  };

  const { clusters, allTypes } = createTypeClusters(args);

  console.log();
  console.log(`found ${allTypes.length} types definitions`);
  console.log();
  for (const cluster of clusters) {
    console.log(`- ${cluster.clusters.length} instances of ${cluster.name}`);
  }

  const data = JSON.stringify(clusters);

  const htmlFile = resolveOutputFilePath(args.output);

  fs.cpSync(dir('./vis/dist/index.html'), htmlFile);

  const html = fs.readFileSync(htmlFile);
  const replaced = html
    .toString()
    .replace('window.__datajson__="DATA_JSON"', `window.__data__ = ${data}`);
  fs.writeFileSync(htmlFile, replaced);

  // fs.writeFileSync(path.join(reportDir, '/report.json'), data);
}

if (require.main === module) {
  main();
}
