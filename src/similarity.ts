import { isEmpty, symmetricDifference, pluck, intersection } from 'ramda';
import {
  Similarity,
  LiteralType,
  CandidateType,
  FunctionCandidateType,
  EnumCandidateType,
  UnionCandidateType,
} from './types';

const eqValues = (left: unknown[], right: unknown[]) => isEmpty(symmetricDifference(left, right));

function isLiteralType(t: CandidateType) {
  return ['alias', 'interface', 'literal'].includes(t.type);
}

function similarityForArray<T extends { key: string; value: string }>(left: T[], right: T[]) {
  const propertiesKeysEqual = eqValues(pluck('key', left), pluck('key', right));
  const propertiesKeysIntersection = intersection(pluck('key', left), pluck('key', right));
  const propertiesTypesEqual = eqValues(pluck('value', left), pluck('value', right));

  if (propertiesKeysEqual && propertiesTypesEqual) {
    return Similarity.HasIdenticalProperties;
  }

  if (propertiesKeysEqual) {
    return Similarity.HasSimilarProperties;
  }

  if (
    propertiesKeysIntersection.length == left.length ||
    propertiesKeysIntersection.length == right.length
  ) {
    return Similarity.HasSubsetOfProperties;
  }

  return Similarity.Different;
}

function simplifyType(type: CandidateType) {
  if (['alias', 'interface'].includes(type.type)) {
    return 'literal';
  }
  return type.type;
}

export function similarity(leftCandidate: CandidateType, rightCandidate: CandidateType) {
  if (leftCandidate.type !== rightCandidate.type) {
    return Similarity.Different;
  }
  const leftType = simplifyType(leftCandidate);
  const rightType = simplifyType(rightCandidate);

  if (leftType === 'enum' && rightType === 'enum') {
    const left = <EnumCandidateType>leftCandidate;
    const right = <EnumCandidateType>rightCandidate;
    const namesEqual = left.name === right.name;
    const hasEqualLength = left.members.length === right.members.length;
    const parametersEqual =
      hasEqualLength && intersection(left.members, right.members).length === left.members.length;
    if (namesEqual && parametersEqual) {
      return Similarity.Identical;
    }
    if (parametersEqual) {
      return Similarity.HasIdenticalProperties;
    }
    return Similarity.Different;
  }
  if (leftType === 'union' && rightType === 'union') {
    const left = <UnionCandidateType>leftCandidate;
    const right = <UnionCandidateType>rightCandidate;
    const namesEqual = left.name === right.name;
    const hasEqualLength = left.types.length === right.types.length;
    const parametersEqual =
      hasEqualLength && intersection(left.types, right.types).length === left.types.length;
    if (namesEqual && parametersEqual) {
      return Similarity.Identical;
    }
    if (parametersEqual) {
      return Similarity.HasIdenticalProperties;
    }
    return Similarity.Different;
  }
  if (leftType === 'function' && rightType === 'function') {
    const left = <FunctionCandidateType>leftCandidate;
    const right = <FunctionCandidateType>rightCandidate;
    const namesEqual = left.name === right.name;
    const parametersEqual = similarityForArray(left.parameters, right.parameters);
    if (namesEqual && parametersEqual === Similarity.HasIdenticalProperties) {
      return Similarity.Identical;
    }
    return parametersEqual;
  }
  if (leftType === 'literal' && rightType === 'literal') {
    const left = isLiteralType(leftCandidate) ? <LiteralType>leftCandidate : null;
    const right = isLiteralType(rightCandidate) ? <LiteralType>rightCandidate : null;
    if (left === null || right === null) {
      return Similarity.Different;
    }
    const namesEqual = left.name === right.name;
    const propertiesEqual = similarityForArray(left.properties, right.properties);
    if (namesEqual && propertiesEqual === Similarity.HasIdenticalProperties) {
      return Similarity.Identical;
    }
    return propertiesEqual;
  }
  return Similarity.Different;
}

export function similarityMatrix(types: CandidateType[]) {
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
      const s = m[i][j];
      if (s === Similarity.Different) {
        continue;
      }
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
