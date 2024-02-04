import { scan } from './scan.js';
import { Metadata, ReportProps, ReportResult, ScanProps } from './types.js';
import { createLogger, stringify } from '@ts-retype/utils';
import { compress } from './compress.js';

const log = createLogger(console.log);

export function report(args: ScanProps & ReportProps, html: string): string {
    log.log('running with args');
    log.log(stringify(args));
    log.log();

    const { rootDir, noHtml, json } = args;

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

        return replaced;
    }

    if (typeof json === 'string') {
        return JSON.stringify({
            data: compressed,
            meta,
        } as ReportResult);
    }

    return `If noHtml is set, json must be set to a file path.
        If no json is set, noHtml must be false.`;
}
