import fs from 'fs';
import { scan } from './scan.js';
import { resolveOutputFilePath } from './cmd.js';
import { createLogger } from './log.js';
import { Metadata, ReportProps, ReportResult, ScanProps } from './types.js';
import { dir, stringify } from '@ts-retype/utils';
import { compress } from './compress.js';

const log = createLogger(console.log);

function findTemplate(): string | null {
    let distPath = dir('index.html');
    if (!fs.existsSync(distPath)) {
        distPath = dir('../../vis/dist/index.html');
        log.log('could not find index.html in src/ or dist/');
    }
    return distPath;
}

export function report(args: ScanProps & ReportProps) {
    log.log('running with args');
    log.log(stringify(args));
    log.log();

    const { rootDir, noHtml, output, json } = args;

    log.log(`scanning types in ${rootDir}`);

    const { data: duplicates, meta: scanMeta } = scan(args);

    log.log();
    log.log(`found ${duplicates.length} duplicates`);
    log.log();

    const compressed = compress(duplicates);

    const dataJson = JSON.stringify(compressed);

    const meta: Metadata = {
        ...scanMeta,
        reportSize: 0,
        appSize: 0,
        dataSize: 0,
    };

    if (!noHtml) {
        const htmlFile = resolveOutputFilePath(output);

        const templateFile = findTemplate();
        if (!templateFile) {
            log.log('missing template file. Try running `npm run vis:build`');
            return;
        }
        fs.cpSync(templateFile, htmlFile);

        const html = fs.readFileSync(htmlFile).toString();

        const withDataJson = html.replace(
            'window.__datajson__="DATA_JSON"',
            `window.__data__ = ${dataJson}`,
        );

        meta.reportSize = withDataJson.length;
        meta.appSize = html.length;
        meta.dataSize = dataJson.length;

        log.table(meta);

        const metaJson = JSON.stringify(meta);

        const replaced = withDataJson.replace(
            'window.__metajson__="META_JSON"',
            `window.__meta__ = ${metaJson}`,
        );
        fs.writeFileSync(htmlFile, replaced);

        log.log(`report exported to ${htmlFile}`);
        log.log('you can view it by running');
        log.log();
        log.log(`  open ${htmlFile}`);
        log.log();
    }

    if (typeof json === 'string') {
        fs.writeFileSync(
            json,
            JSON.stringify({
                data: compressed,
                meta,
            } as ReportResult),
        );
        log.log(`json data exported to ${json}`);
        log.log();
    }
}
