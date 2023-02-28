import { isEmpty, symmetricDifference, pluck, intersection } from 'ramda';
import { Similarity, LiteralType } from './types';

const eqValues = (left: unknown[], right: unknown[]) => isEmpty(symmetricDifference(left, right));

export function similarity(left: LiteralType, right: LiteralType) {
  const namesEqual = left.name === right.name;
  // const propertiesCountEqual = left.properties.length === right.properties.length;
  const propertiesKeysEqual = eqValues(
    pluck('key', left.properties),
    pluck('key', right.properties),
  );
  const propertiesKeysIntersection = intersection(
    pluck('key', left.properties),
    pluck('key', right.properties),
  );
  const propertiesTypesEqual = eqValues(
    pluck('value', left.properties),
    pluck('value', right.properties),
  );

  if (namesEqual && propertiesKeysEqual && propertiesTypesEqual) {
    return Similarity.Identical;
  }

  if (propertiesKeysEqual && propertiesTypesEqual) {
    return Similarity.HasIdenticalProperties;
  }

  if (propertiesKeysEqual) {
    return Similarity.HasSimilarProperties;
  }

  if (
    propertiesKeysIntersection.length == left.properties.length ||
    propertiesKeysIntersection.length == right.properties.length
  ) {
    return Similarity.HasSubsetOfProperties;
  }

  return Similarity.Different;
}

export function similarityMatrix(types: LiteralType[]) {
  const m = [...Array(types.length)].map(() =>
    Array<Similarity>(types.length).fill(Similarity.Different),
  );
  const idxs = [...Array(types.length).keys()];
  for (const i of idxs) {
    for (const j of idxs) {
      if (i > j) {
        m[i][j] = m[j][i];
        continue;
      }
      if (i === j) {
        m[i][j] = Similarity.Identical;
      } else {
        m[i][j] = similarity(types[i], types[j]);
      }
    }
  }
  return m;
}

export function indexPairsBySimilarity(m: Similarity[][]) {
  const res: { [s: number]: [number, number][] } = {};
  const idxs = [...Array(m.length).keys()];
  for (const i of idxs) {
    for (const j of idxs) {
      if (i >= j) {
        continue;
      }
      const s: number = m[i][j];
      if (!res[s]) {
        res[s] = [];
      }
      res[s].push([i, j]);
    }
  }
  return res;
}

export function pairsToClusters(pairs: [number, number][]) {
  if (!pairs) {
    return [];
  }
  const res: Set<number>[] = [];
  for (const [l, r] of pairs) {
    const pairSet = res.find((nums) => nums.has(l) || nums.has(r));
    if (pairSet) {
      pairSet.add(l).add(r);
    } else {
      res.push(new Set<number>([l, r]));
    }
  }
  return res;
}
