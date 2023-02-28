#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';

import { createTypeClusters } from '../src/clusters';

const cwd = (p: string) => path.join(process.cwd(), p);
const dir = (p: string) => path.join(__dirname, p);

function main() {
  const appDir = process.argv[2] || process.cwd();
  const reportDir = cwd(process.argv[3] || './tsd-report');

  console.log(`searching for duplicates in ${appDir}`);

  const clusters = createTypeClusters({
    dir: appDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  });

  const data = JSON.stringify(clusters);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir);
  } else {
    rimrafSync(reportDir, { preserveRoot: true });
  }

  fs.cpSync(dir('./vis/dist'), reportDir, { recursive: true });

  const html = fs.readFileSync(path.join(reportDir, 'index.html'));
  const replaced = html
    .toString()
    .replace('window.__datajson__="DATA_JSON"', `window.__data__ = ${data}`);
  fs.writeFileSync(path.join(reportDir, '/index.html'), replaced);
  fs.writeFileSync(path.join(reportDir, '/report.json'), data);
}

if (require.main === module) {
  main();
}
