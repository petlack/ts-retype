import path from 'path';
import { concat, omit } from 'ramda';
import { globSync } from 'glob';
import { getAllCandidateTypes as getAllCandidateTypes } from './parse';
import {
  Freq,
  // LiteralType,
  // SourceLiteralType,
  Similarity,
  // TypeCluster,
  SimilarityGroup,
  RetypeArgs,
  CandidateType,
  SourceCandidateType,
  CandidateTypeCluster,
} from './types';
import { formatDuration, loadFile, posToLine } from './utils';
import { similarityMatrix, pairsToClusters, indexPairsBySimilarity } from './similarity';
import { createLogger } from './cmd';

const log = createLogger();

function toSourceCandidateTypes(file: string, types: CandidateType[]): SourceCandidateType[] {
  return types.map((t) => ({ ...t, file }));
}

function freq(list: (string | number | symbol)[]) {
  return list.reduce((res, item) => {
    res[item] = (res[item] || 0) + 1;
    return res;
  }, <Freq>{});
}

function outputCluster(
  types: SourceCandidateType[],
  clusterTypes: Set<number>,
  filesLengths: { [file: string]: number[] },
): CandidateTypeCluster {
  const values = [...clusterTypes.values()].filter((val) => types[val]);
  const firstVal = values[0];
  const toLine = (file: string) => posToLine(filesLengths[file]);
  const files = values
    .map((val) => ({
      type: types[val].type,
      pos: types[val].pos,
      lines: types[val].pos.map(toLine(types[val].file)),
      file: types[val].file,
    }))
    .sort((a, b) => (a.file < b.file ? -1 : 1));
  const names = freq(values.map((val) => types[val].name));
  return {
    ...omit(['file', 'pos'], types[firstVal]),
    files,
    names,
  };
}

function formatFileName(file: string, maxLength = 120) {
  if (file.length > maxLength) {
    const ellipsis = '..';
    const extra = file.length - maxLength + ellipsis.length;
    const half = Math.floor(extra / 2);
    return file.slice(0, half) + ellipsis + file.slice(half + extra);
  }
  return file;
}

function nonEmptyCandidateType(type: CandidateType): boolean {
  return true;
}

export function createTypeClusters({ project, include, exclude }: RetypeArgs): SimilarityGroup[] {
  const files = globSync(include, { cwd: project, ignore: exclude });

  const filesLengths: { [file: string]: number[] } = {};
  let allTypes: SourceCandidateType[] = [];

  const start = new Date().getTime();

  log.log(`searching in ${files.length.toLocaleString()} files`);

  for (const relPath of files) {
    const file = path.join(project, relPath);
    log.live(`⏳ loading ${formatFileName(file)}`);
    const srcFile = loadFile(file);
    const lengths = srcFile
      .getFullText()
      .split('\n')
      .map((l) => l.length);
    filesLengths[file] = lengths;
    const candidateTypes = getAllCandidateTypes(srcFile);
    const types = toSourceCandidateTypes(file, candidateTypes).filter(nonEmptyCandidateType);
    allTypes = concat(allTypes, types);
  }
  const locs = Object.values(filesLengths).reduce((a, b) => a + b.length, 0);
  log.live(`searched  ${locs.toLocaleString()} lines of code`, true);
  log.log(`found ${allTypes.length.toLocaleString()} types definitions`);

  const duration = new Date().getTime() - start;
  log.log(`took ${formatDuration(duration)}`);

  const matrix = similarityMatrix(allTypes);
  // printMatrix(matrix)

  const index = indexPairsBySimilarity(matrix);

  const clusters: SimilarityGroup[] = Object.entries(index).map(([k, v]) => ({
    name: Similarity[Number(k)],
    clusters: pairsToClusters(v)
      .sort((a, b) => b.size - a.size)
      .map((c) => outputCluster(allTypes, c, filesLengths)),
  }));

  return clusters;
}
