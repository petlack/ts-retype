import { isEmpty, symmetricDifference, pluck, intersection, concat, uniq } from 'ramda';
import Progress from 'progress';
import {
  Similarity,
  LiteralType,
  CandidateType,
  FunctionCandidateType,
  EnumCandidateType,
  UnionCandidateType,
  SourceCandidateType,
  ClusterOutput,
  LiteralCandidateType,
} from './types';
import { freq, posToLine, selectIndices } from './utils';

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

type Clusters = { [s in Similarity]?: Set<number>[] };

export function pairsToClusters(pairs: [number, number, Similarity][]) {
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

function chooseClusterNames(types: SourceCandidateType[], idxs: Iterable<number>) {
  return freq(pluck('name', selectIndices(types, idxs)));
}

function chooseClusterFiles(
  types: SourceCandidateType[],
  idxs: Iterable<number>,
  lengths: FileLengths,
) {
  const toLine = (file: string) => posToLine(lengths[file]);
  return selectIndices(types, idxs).map((t) => ({
    file: t.file,
    type: t.type,
    pos: t.pos,
    lines: t.pos.map(toLine(t.file)),
  }));
}

function chooseClusterType(types: SourceCandidateType[], idxs: Iterable<number>) {
  return selectIndices(types, idxs)[0].type;
}

function chooseClusterName(types: SourceCandidateType[], idxs: Iterable<number>) {
  return selectIndices(types, idxs)[0].name;
}

function chooseTypeFeatures(types: SourceCandidateType[], idxs: Iterable<number>) {
  const selected = selectIndices(types, idxs);
  const selectedTypes = uniq(pluck('type', selected));
  if (selectedTypes.length > 1) {
    console.log('warning: multiple types in a similarity group');
  }
  const type = selectedTypes[0];
  switch (type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return {
        properties: (selected[0] as unknown as LiteralCandidateType).properties,
      };
    case 'enum':
      return {
        members: (selected[0] as unknown as EnumCandidateType).members,
      };
    case 'function':
      return {
        parameters: (selected[0] as unknown as FunctionCandidateType).parameters,
        returnType: (selected[0] as unknown as FunctionCandidateType).returnType,
      };
    case 'union':
      return {
        types: (types[0] as unknown as UnionCandidateType).types,
      };
  }
}

type FileLengths = { [file: string]: number[] };

export function clustersToOutput(
  types: SourceCandidateType[],
  clusters: Clusters,
  lengths: FileLengths,
): ClusterOutput[] {
  const res = Object.entries(clusters).reduce(
    (res, [group, clusters]) =>
      concat(
        res,
        clusters.map((idxs) => ({
          names: chooseClusterNames(types, idxs),
          files: chooseClusterFiles(types, idxs, lengths),
          name: chooseClusterName(types, idxs),
          type: chooseClusterType(types, idxs),
          group: Similarity[group as keyof typeof Similarity],
          ...chooseTypeFeatures(types, idxs),
        })),
      ),
    [] as ClusterOutput[],
  );
  return res;
}
