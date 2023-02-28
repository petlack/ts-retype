import path from 'path';
import { omit } from 'ramda';
import { globSync } from 'glob';
import { getAllLiteralTypes } from './parse';
import {
  Freq,
  LiteralType,
  SourceLiteralType,
  Similarity,
  TypeCluster,
  SimilarityGroup,
} from './types';
import { loadFile } from './utils';
import { similarityMatrix, pairsToClusters, indexPairsBySimilarity } from './similarity';

function toSourceLiteralTypes(file: string, types: LiteralType[]) {
  return types.map((t) => <SourceLiteralType>{ ...t, file });
}

function freq(list: (string | number | symbol)[]) {
  return list.reduce((res, item) => {
    res[item] = (res[item] || 0) + 1;
    return res;
  }, <Freq>{});
}

function clusterValue(types: SourceLiteralType[], cluster: Set<number>): TypeCluster {
  const values = [...cluster.values()].filter((val) => types[val]);
  const firstVal = values[0];
  const files = values
    .map((val) => ({ pos: types[val].pos, file: types[val].file }))
    .sort((a, b) => (a.file < b.file ? -1 : 1));
  const names = freq(values.map((val) => types[val].name));
  return {
    ...omit(['file', 'pos'], types[firstVal]),
    files,
    names,
  };
}

export function createTypeClusters({
  dir,
  glob = '**/*.ts',
  ignore = ['**/node_modules/**', '**/dist/**'],
}: {
  dir: string;
  glob?: string;
  ignore?: string[];
}) {
  const files = globSync(glob, { cwd: dir, ignore });

  let allTypes: SourceLiteralType[] = [];
  for (const relPath of files) {
    const file = path.join(dir, relPath);
    console.log(`= loading ${file}`);
    const srcFile = loadFile(file);
    const types = toSourceLiteralTypes(file, getAllLiteralTypes(srcFile));
    allTypes = [...allTypes, ...types];
  }

  const matrix = similarityMatrix(allTypes);
  // printMatrix(matrix)

  const index = indexPairsBySimilarity(matrix);

  const clusters: SimilarityGroup[] = Object.entries(index).map(([k, v]) => ({
    name: Similarity[Number(k)],
    clusters: pairsToClusters(v)
      .sort((a, b) => b.size - a.size)
      .map((c) => clusterValue(allTypes, c)),
  }));

  return clusters;
}
