import { cpSync, readFileSync, writeFileSync } from 'fs';
import { scan } from './scan.js';
import { resolveOutputFilePath } from './cmd.js';
import { Metadata, ReportProps, ReportResult, ScanProps } from './types.js';
import { createLogger, stringify } from '@ts-retype/utils';
import { compress } from './compress.js';

const log = createLogger(console.log);

// const dir = (p: string) => join(__dirname, p);
// function findTemplate(): string | null {
//     let distPath = dir('index.html');
//     console.log('distPath', distPath);
//     if (!existsSync(distPath)) {
//         distPath = dir('../../vis/dist/index.html');
//         log.log('could not find index.html in src/ or dist/');
//     }
//     return distPath;
// }


export function report(args: ScanProps & ReportProps, templateFile: string) {
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

        cpSync(templateFile, htmlFile);

        const html = readFileSync(htmlFile).toString();

        const withDataJson = html.replace(
            /window\.__datajson__\s*=\s*"DATA_JSON"/,
            `window.__data__ = ${dataJson}`,
        );

        meta.reportSize = withDataJson.length;
        meta.appSize = html.length;
        meta.dataSize = dataJson.length;

        log.table(meta);

        const metaJson = JSON.stringify(meta);

        const replaced = withDataJson.replace(
            /window\.__metajson__\s*=\s*"DATA_JSON"/,
            `window.__meta__ = ${metaJson}`,
        );
        writeFileSync(htmlFile, replaced);

        log.log(`report exported to ${htmlFile}`);
        log.log('you can view it by running');
        log.log();
        log.log(`  open ${htmlFile}`);
        log.log();
    }

    if (typeof json === 'string') {
        writeFileSync(
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
