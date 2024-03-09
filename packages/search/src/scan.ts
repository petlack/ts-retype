import {
    Logger,
    Progress,
    formatDuration,
} from '@ts-retype/utils';
import { Metadata, ScanProps, TypeDuplicate } from './types.js';
import { clustersToDuplicates, findTypesInFile } from './clusters.js';
import { computeSimilarityMatrix, similarityMatrixToClusters } from './similarity.js';
import { join, basename, resolve } from 'path';
import { SourceCandidateType } from './types/candidate.js';
import { globSync } from 'glob';
import { loadFile } from './utils.js';

const log = new Logger('scan');

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
    let start = new Date().getTime();

    const files = globSync(include, { cwd: rootDir, ignore: exclude });
    const filesLengths: { [file: string]: number[] } = {};
    const filesTypesCount: { [file: string]: number } = {};
    const allTypes: SourceCandidateType[] = [];

    log.info(`Searching in ${files.length.toLocaleString()} files`);

    for (const relPath of files) {
        const file = join(rootDir, relPath);
        log.update.info(`⏳ Loading ${formatFileName(file)}`);

        const srcFile = loadFile(file);
        const { types, lengths } = findTypesInFile(srcFile, relPath);

        filesLengths[relPath] = lengths;
        filesTypesCount[relPath] = types.length;
        allTypes.push(...types);
    }
    const locs = Object.values(filesLengths).reduce((a, b) => a + b.length, 0);
    const filesWithTypes = Object.entries(filesTypesCount).filter(([, count]) => count > 0).length;

    log.update.info(`Searched  ${locs.toLocaleString()} lines of code\n`);
    log.info(`Found ${allTypes.length.toLocaleString()} types definitions`);
    log.info(`took ${formatDuration(new Date().getTime() - start)}`);
    log.bare();

    start = new Date().getTime();
    log.info('Computing Similarity Matrix');

    const bar = Progress.finite((allTypes.length * (allTypes.length + 1)) / 2);
    let lastDraw = new Date().getTime();

    const matrix = computeSimilarityMatrix(allTypes, by => {
        bar.advanceBy(by);
        const now = new Date().getTime();
        if (now - lastDraw > 100) {
            lastDraw = now;
            log.update.info(bar.format());
        }
    });
    log.bare();

    log.info(`took ${formatDuration(new Date().getTime() - start)}`);
    log.bare();

    start = new Date().getTime();
    log.info('Generating output');

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
        matrixSize: matrix.size(),
        scannedAt: new Date().toISOString(),
        scanDuration: duration,
    };

    log.info(`took ${formatDuration(duration)}`);
    log.bare();

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
