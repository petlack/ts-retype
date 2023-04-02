import path from 'path';
import { globSync } from 'glob';
import { concat } from 'ramda';
import { getTypesInFile } from './clusters';
import { createLogger } from './log';
import {
  similarityMatrix,
  toSimilarityPairs,
  pairsToClusters,
  clustersToOutput,
} from './similarity';
import { ScanArgs, SourceCandidateType, TypeDuplicate } from './types';
import { loadFile, formatDuration } from './utils';

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

export function scan({ rootDir, exclude, include }: ScanArgs): TypeDuplicate[] {
  const files = globSync(include, { cwd: rootDir, ignore: exclude });
  const filesLengths: { [file: string]: number[] } = {};
  let allTypes: SourceCandidateType[] = [];
  let start = new Date().getTime();

  log.log(`searching in ${files.length.toLocaleString()} files`);

  for (const relPath of files) {
    const file = path.join(rootDir, relPath);
    log.live(`⏳ loading ${formatFileName(file)}`);
    const srcFile = loadFile(file);
    const { types, lengths } = getTypesInFile(srcFile, relPath);
    filesLengths[relPath] = lengths;
    allTypes = concat(allTypes, types);
  }
  const locs = Object.values(filesLengths).reduce((a, b) => a + b.length, 0);

  log.live(`searched  ${locs.toLocaleString()} lines of code`, true);
  log.log(`found ${allTypes.length.toLocaleString()} types definitions`);
  log.log(`took ${formatDuration(new Date().getTime() - start)}`);
  log.log();

  start = new Date().getTime();
  log.log('computing similarity matrix');

  const matrix = similarityMatrix(allTypes);

  log.log(`took ${formatDuration(new Date().getTime() - start)}`);
  log.log();

  start = new Date().getTime();
  log.log('generating output');

  const pairs = toSimilarityPairs(matrix);
  const clusters = pairsToClusters(pairs);
  const output = clustersToOutput(allTypes, clusters, filesLengths);

  log.log(`took ${formatDuration(new Date().getTime() - start)}`);
  log.log();

  return output;
}
