#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';

import { createTypeClusters } from '../src/clusters';

const cwd = (p: string) => path.join(process.cwd(), p);
const dir = (p: string) => path.join(__dirname, p);

function parseArgs(argv: string[]) {
  let option = null;
  const result: { [key: string]: boolean | string | null } = {};
  for (const arg of argv) {
    if (!arg.length) {
      continue;
    }
    if (arg[0] === '-') {
      if (option) {
        result[option] = true;
      }
      option = arg.slice(1);
    }
    else {
      if (option) {
        result[option] = arg;
        option = null;
      }
    }
  }
  if (option) {
    result[option] = true;
  }
  return result;
}

function main() {
  const appDir = process.argv[2] || process.cwd();
  const options = parseArgs(process.argv);
  const loadsConfig = <boolean>options.c;
  let configFile = cwd('.retyperc');
  
  if (!!options.c !== options.c) {
    configFile = <string>options.c;
  }

  let config = {
    dir: appDir,
    output: './retype-report.html',
    glob: '**/*.ts',
    ignore: ['**/node_modules/**', '**/dist/**', '**/generated/**'],
  };

  if (loadsConfig) {
    config = {
      ...config,
      ...JSON.parse(fs.readFileSync(configFile).toString()),
    };
  }

  if (options.o && typeof options.o === 'string') {
    config.output = <string>options.o;
  }

  const outputFile = config.output;

  console.log(`searching for duplicates in ${appDir}`);

  const clusters = createTypeClusters(config);

  const data = JSON.stringify(clusters);

  let htmlFile = outputFile;
  let isDir = false;
  if (!fs.existsSync(outputFile)) {
    if (!outputFile.endsWith('.html')) {
      isDir = true;
    }
  } else {
    if (fs.lstatSync(outputFile).isDirectory()) {
      isDir = true;
    }
  }
  if (isDir) {
    htmlFile = path.join(outputFile, 'index.html');
    if (!fs.existsSync(outputFile)) {
      fs.mkdirSync(outputFile, { recursive: true });
    } else {
      rimrafSync(outputFile, { preserveRoot: true });
    }
  }
  else {
    htmlFile = outputFile;
    const parentDir = path.dirname(htmlFile);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  }

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
