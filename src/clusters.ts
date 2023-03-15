import path from 'path';
import { concat } from 'ramda';
import { globSync } from 'glob';
import { getAllCandidateTypes as getAllCandidateTypes } from './parse';
import {
  RetypeArgs,
  CandidateType,
  SourceCandidateType,
  LiteralCandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
  TypeDuplicate,
} from './types';
import { formatDuration, loadFile } from './utils';
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

export function findTypeDuplicates({ project, include, exclude }: RetypeArgs): TypeDuplicate[] {
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
