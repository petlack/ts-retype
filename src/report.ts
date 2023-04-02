import fs from 'fs';
import { scan } from './scan';
import { resolveOutputFilePath } from './cmd';
import { createLogger } from './log';
import { ReportArgs, ScanArgs } from './types';
import { dir, stringify } from './utils';

const log = createLogger(console.log);

function findTemplate(): string | null {
  const distPath = dir('index.html');
  const srcPath = dir('../vis/dist/index.html');
  const runningFromDist = fs.existsSync(dir('package.json'));
  const runningFromSrc = fs.existsSync(srcPath);
  if (runningFromDist) {
    return distPath;
  }
  if (runningFromSrc) {
    return srcPath;
  }
  log.log('could not find index.html in src/ or dist/');
  return null;
}

export function report(args: ScanArgs & ReportArgs) {
  log.log('running with args');
  log.log(stringify(args));
  log.log();

  const { rootDir, noHtml, output, json } = args;

  log.log(`scanning types in ${rootDir}`);

  const duplicates = scan(args);

  log.log();
  log.log(`found ${duplicates.length} duplicates`);

  const data = JSON.stringify(duplicates);

  log.log();

  if (!noHtml) {
    const htmlFile = resolveOutputFilePath(output);

    const templateFile = findTemplate();
    if (!templateFile) {
      log.log('missing template file. Try running `npm run vis:build`');
      return;
    }
    fs.cpSync(templateFile, htmlFile);

    const html = fs.readFileSync(htmlFile);
    const replaced = html
      .toString()
      .replace('window.__datajson__="DATA_JSON"', `window.__data__ = ${data}`);
    fs.writeFileSync(htmlFile, replaced);

    log.log(`report exported to ${htmlFile}`);
    log.log('you can view it by running');
    log.log();
    log.log(`  open ${htmlFile}`);
    log.log();
  }

  if (typeof json === 'string') {
    fs.writeFileSync(json, data);
    log.log(`json data exported to ${json}`);
    log.log();
  }
}
