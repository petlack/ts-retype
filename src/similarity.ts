import { isEmpty, symmetricDifference, pluck, intersection } from 'ramda';
import Progress from 'progress';
import {
  CandidateType,
  Property,
  EnumCandidateType,
  UnionCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
} from './types/candidate';
import { Similarity, Clusters } from './types/similarity';

const eqValues = (left: unknown[], right: unknown[]) => isEmpty(symmetricDifference(left, right));

function isLiteralType(t: CandidateType) {
  return ['interface', 'literal'].includes(t.type);
}

function similarityForArray<T extends Property>(left: T[], right: T[]) {
  const propertiesKeysEqual = eqValues(pluck('name', left), pluck('name', right));
  const propertiesKeysIntersection = intersection(pluck('name', left), pluck('name', right));
  const propertiesTypesEqual = eqValues(pluck('type', left), pluck('type', right));

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
  if (isLiteralType(type)) {
    return 'literal';
  }
  return type.type;
}

export function similarity(leftCandidate: CandidateType, rightCandidate: CandidateType) {
  const leftType = simplifyType(leftCandidate);
  const rightType = simplifyType(rightCandidate);
  if (leftType !== rightType) {
    return Similarity.Different;
  }

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
    const returnTypesEqual = left.returnType === right.returnType;
    const parametersTypesEqual = eqValues(
      pluck('type', left.parameters),
      pluck('type', right.parameters),
    );
    const parametersNamesEqual = eqValues(
      pluck('name', left.parameters),
      pluck('name', right.parameters),
    );
    const parametersSimilarity = parametersTypesEqual
      ? parametersNamesEqual
        ? Similarity.Identical
        : Similarity.HasIdenticalProperties
      : Similarity.Different;
    const parametersEqual = parametersSimilarity !== Similarity.Different;
    if (returnTypesEqual) {
      if (namesEqual && parametersEqual) {
        return parametersSimilarity;
      }
      if (parametersEqual) {
        return Similarity.HasIdenticalProperties;
      }
    }
    return Similarity.Different;
  }
  if (leftType === 'literal' && rightType === 'literal') {
    const left = <LiteralCandidateType>leftCandidate;
    const right = <LiteralCandidateType>rightCandidate;
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
  const bar = new Progress('[:bar] :rate/bps :percent :etas :current/:total', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: (types.length * (types.length + 1)) / 2,
  });
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
      bar.tick();
      if (i === j) {
        m[i][j] = Similarity.Identical;
      } else {
        m[i][j] = similarity(types[i], types[j]);
      }
    }
  }
  return m;
}

export function toSimilarityPairs(m: Similarity[][]): [number, number, Similarity][] {
  const res: [number, number, Similarity][] = [];
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
      res.push([i, j, s]);
    }
  }

  return res;
}

export function pairsToClusters(pairs: [number, number, Similarity][]): Clusters {
  if (!pairs) {
    return {} as Clusters;
  }
  const res: Clusters = {};
  for (const [l, r, s] of pairs) {
    if (!res[s]) {
      res[s] = [];
    }
    const pairSet = res[s]?.find((nums) => nums.has(l) || nums.has(r));
    if (pairSet) {
      pairSet.add(l).add(r);
    } else {
      res[s]?.push(new Set<number>([l, r]));
    }
  }
  return res;
}
