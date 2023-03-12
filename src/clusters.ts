import path from 'path';
import { concat, omit } from 'ramda';
import { globSync } from 'glob';
import { getAllCandidateTypes as getAllCandidateTypes } from './parse';
import {
  Freq,
  Similarity,
  SimilarityGroup,
  RetypeArgs,
  CandidateType,
  SourceCandidateType,
  CandidateTypeCluster,
  LiteralCandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
  ClusterOutput,
} from './types';
import { formatDuration, loadFile, posToLine } from './utils';
import {
  similarityMatrix,
  pairsToClusters,
  toSimilarityPairs,
  clustersToOutput,
} from './similarity';
import { createLogger } from './cmd';
import ts from 'typescript';

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
  switch (type.type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return (<LiteralCandidateType>type).properties.length > 0;
    case 'enum':
      return (<EnumCandidateType>type).members.length > 0;
    case 'function':
      return (<FunctionCandidateType>type).parameters.length > 0;
    case 'union':
      return (<UnionCandidateType>type).types.length > 0;
  }
}

export function getTypesInFile(srcFile: ts.SourceFile, relPath: string) {
  const lengths = srcFile
    .getFullText()
    .split('\n')
    .map((l) => l.length);
  const candidateTypes = getAllCandidateTypes(srcFile);
  const types = toSourceCandidateTypes(relPath, candidateTypes).filter(nonEmptyCandidateType);
  return { types, lengths };
}

export function createTypeClusters({ project, include, exclude }: RetypeArgs): ClusterOutput[] {
  const files = globSync(include, { cwd: project, ignore: exclude });

  const filesLengths: { [file: string]: number[] } = {};
  let allTypes: SourceCandidateType[] = [];

  let start = new Date().getTime();

  log.log(`searching in ${files.length.toLocaleString()} files`);
  for (const relPath of files) {
    const file = path.join(project, relPath);
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
