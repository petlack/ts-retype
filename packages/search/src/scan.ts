import { Logger, formatDuration } from '@ts-retype/utils';
import { Metadata, ScanProps, TypeDuplicate } from './types.js';
import { computeSimilarityMatrix, similarityMatrixToClusters } from './similarity.js';
import { clustersToDuplicates, findTypesInFile } from './clusters.js';
import { join, basename, resolve } from 'path';
import { Progress } from '@ts-retype/utils';
import { SourceCandidateType } from './types/candidate.js';
import { concat } from 'ramda';
import { globSync } from 'glob';
import { loadFile } from './utils.js';

const log = new Logger();

export type ScanResult = {
    data: TypeDuplicate[];
    meta: Omit<Metadata, 'reportSize' | 'dataSize' | 'appSize'>;
};

/**
* Scans the given directory and returns the duplicates with statistics about the scan
*/
export function scan(
    { rootDir, exclude, include }: ScanProps,
): ScanResult {
    const files = globSync(include, { cwd: rootDir, ignore: exclude });
    const filesLengths: { [file: string]: number[] } = {};
    const filesTypesCount: { [file: string]: number } = {};

    let allTypes: SourceCandidateType[] = [];
    let start = new Date().getTime();

    log.info(`searching in ${files.length.toLocaleString()} files`);

    for (const relPath of files) {
        const file = join(rootDir, relPath);
        log.amend(`⏳ loading ${formatFileName(file)}`);

        const srcFile = loadFile(file);
        const { types, lengths } = findTypesInFile(srcFile, relPath);

        filesLengths[relPath] = lengths;
        filesTypesCount[relPath] = types.length;
        allTypes = concat(allTypes, types);
    }
    const locs = Object.values(filesLengths).reduce((a, b) => a + b.length, 0);
    const filesWithTypes = Object.entries(filesTypesCount).filter(([, count]) => count > 0).length;

    log.amend(`searched  ${locs.toLocaleString()} lines of code`, true);
    log.info(`found ${allTypes.length.toLocaleString()} types definitions`);
    log.info(`took ${formatDuration(new Date().getTime() - start)}`);
    log.info();

    start = new Date().getTime();
    log.info('computing similarity matrix');

    const bar = Progress.finite((allTypes.length * (allTypes.length + 1)) / 2);
    let lastDraw = new Date().getTime();

    const matrix = computeSimilarityMatrix(allTypes, by => {
        bar.advanceBy(by);
        const now = new Date().getTime();
        if (now - lastDraw > 100) {
            lastDraw = now;
            process.stderr.cursorTo(0);
            process.stderr.write(bar.format());
            process.stderr.clearLine(1);
        }
    });

    log.info(`took ${formatDuration(new Date().getTime() - start)}`);
    log.info();

    start = new Date().getTime();
    log.info('generating output');

    const clusters = similarityMatrixToClusters(matrix);
    const data = clustersToDuplicates(allTypes, clusters).filter(
        ({ group }) => group !== 'different',
    );

    const duration = new Date().getTime() - start;

    const meta: ScanResult['meta'] = {
        projectName: basename(resolve(rootDir)),
        projectFilesScanned: files.length,
        projectLocScanned: locs,
        projectTypesScanned: allTypes.length,
        projectFilesWithTypesDeclarations: filesWithTypes,
        scannedAt: new Date().toISOString(),
        scanDuration: duration,
    };

    log.info(`took ${formatDuration(duration)}`);
    log.info();

    return {
        data,
        meta,
    };
}

function formatFileName(
    file: string,
    maxLength = 120,
): string {
    if (file.length > maxLength) {
        const ellipsis = '..';
        const extra = file.length - maxLength + ellipsis.length;
        const half = Math.floor(extra / 2);
        return file.slice(0, half) + ellipsis + file.slice(half + extra);
    }
    return file;
}
