import { Metadata, ScanProps, TypeDuplicate } from './types.js';
import { clustersToDuplicates, findTypesInFile } from './clusters.js';
import { computeSimilarityMatrix, similarityMatrixToClusters } from './similarity.js';
import { createLogger, formatDuration } from '@ts-retype/utils';
import Progress from 'progress';
import { SourceCandidateType } from './types/candidate.js';
import { concat } from 'ramda';
import { globSync } from 'glob';
import { loadFile } from './utils.js';
import { join, basename, resolve } from 'path';

const log = createLogger(console.log);

function formatFileName(file: string, maxLength = 120) {
    if (file.length > maxLength) {
        const ellipsis = '..';
        const extra = file.length - maxLength + ellipsis.length;
        const half = Math.floor(extra / 2);
        return file.slice(0, half) + ellipsis + file.slice(half + extra);
    }
    return file;
}

export type ScanResult = {
  data: TypeDuplicate[];
  meta: Omit<Metadata, 'reportSize' | 'dataSize' | 'appSize'>;
};

export function scan({ rootDir, exclude, include }: ScanProps): ScanResult {
    const files = globSync(include, { cwd: rootDir, ignore: exclude });
    const filesLengths: { [file: string]: number[] } = {};
    const filesTypesCount: { [file: string]: number } = {};

    let allTypes: SourceCandidateType[] = [];
    let start = new Date().getTime();

    log.log(`searching in ${files.length.toLocaleString()} files`);

    for (const relPath of files) {
        const file = join(rootDir, relPath);
        log.live(`⏳ loading ${formatFileName(file)}`);

        const srcFile = loadFile(file);
        const { types, lengths } = findTypesInFile(srcFile, relPath);

        filesLengths[relPath] = lengths;
        filesTypesCount[relPath] = types.length;
        allTypes = concat(allTypes, types);
    }
    const locs = Object.values(filesLengths).reduce((a, b) => a + b.length, 0);
    const filesWithTypes = Object.entries(filesTypesCount).filter(([, count]) => count > 0).length;

    log.live(`searched  ${locs.toLocaleString()} lines of code`, true);
    log.log(`found ${allTypes.length.toLocaleString()} types definitions`);
    log.log(`took ${formatDuration(new Date().getTime() - start)}`);
    log.log();

    start = new Date().getTime();
    log.log('computing similarity matrix');

    const bar = new Progress('[:bar] :rate/tps :percent :etas :current/:total', {
        complete: '=',
        incomplete: ' ',
        width: 30,
        total: (allTypes.length * (allTypes.length + 1)) / 2,
    });

    const matrix = computeSimilarityMatrix(allTypes, () => bar.tick());

    log.log(`took ${formatDuration(new Date().getTime() - start)}`);
    log.log();

    start = new Date().getTime();
    log.log('generating output');

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

    log.log(`took ${formatDuration(duration)}`);
    log.log();

    return {
        data,
        meta,
    };
}
