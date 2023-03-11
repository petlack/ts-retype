import path from 'path';
import { omit, sum } from 'ramda';
import { globSync } from 'glob';
import { getAllLiteralTypes } from './parse';
import {
  Freq,
  LiteralType,
  SourceLiteralType,
  Similarity,
  TypeCluster,
  SimilarityGroup,
  RetypeArgs,
} from './types';
import { formatDuration, loadFile, posToLine } from './utils';
import { similarityMatrix, pairsToClusters, indexPairsBySimilarity } from './similarity';
import { createLogger } from './cmd';

const log = createLogger();

function toSourceLiteralTypes(file: string, types: LiteralType[]) {
  return types.map((t) => <SourceLiteralType>{ ...t, file });
}

function freq(list: (string | number | symbol)[]) {
  return list.reduce((res, item) => {
    res[item] = (res[item] || 0) + 1;
    return res;
  }, <Freq>{});
}

function clusterValue(
  types: SourceLiteralType[],
  cluster: Set<number>,
  filesLengths: { [file: string]: number[] },
): TypeCluster {
  const values = [...cluster.values()].filter((val) => types[val]);
  const firstVal = values[0];
  const toLine = (file: string) => posToLine(filesLengths[file]);
  const files = values
    .map((val) => ({
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

export function createTypeClusters({ project, include, exclude }: RetypeArgs) {
  const files = globSync(include, { cwd: project, ignore: exclude });

  const filesLengths: { [file: string]: number[] } = {};
  let allTypes: SourceLiteralType[] = [];

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
    const types = toSourceLiteralTypes(file, getAllLiteralTypes(srcFile)).filter(
      (t) => t.properties.length > 0,
    );
    allTypes = [...allTypes, ...types];
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
      .map((c) => clusterValue(allTypes, c, filesLengths)),
  }));

  return clusters;
}
