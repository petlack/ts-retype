import { isEmpty, symmetricDifference, pluck, intersection, concat, uniq } from 'ramda';
import Progress from 'progress';
import {
  Similarity,
  CandidateType,
  FunctionCandidateType,
  EnumCandidateType,
  UnionCandidateType,
  SourceCandidateType,
  TypeDuplicate,
  LiteralCandidateType,
  Property,
} from './types';
import { freq, posToLine, selectIndices } from './utils';

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

type Clusters = { [s in Similarity]?: Set<number>[] };

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
    lines: t.pos.map(toLine(t.file)) as [number, number],
  }));
}

function propertyToOutput(prop: Property): Property {
  return {
    name: prop.name,
    type: prop.type,
  };
}

function chooseTypeFeatures(types: SourceCandidateType[], idxs: Iterable<number>) {
  const selected = selectIndices(types, idxs);
  const selectedTypes = uniq(pluck('type', selected));
  // if (selectedTypes.length > 1) {
  //   console.log('warning: multiple types in a similarity group');
  // }
  const type = selectedTypes[0];
  switch (type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return {
        properties: (selected[0] as unknown as LiteralCandidateType).properties.map(
          propertyToOutput,
        ),
      };
    case 'enum':
      return {
        members: (selected[0] as unknown as EnumCandidateType).members,
      };
    case 'function':
      return {
        parameters: (selected[0] as unknown as FunctionCandidateType).parameters.map(
          propertyToOutput,
        ),
        returnType: (selected[0] as unknown as FunctionCandidateType).returnType,
      };
    case 'union':
      return {
        types: (types[0] as unknown as UnionCandidateType).types,
      };
  }
}

type FileLengths = { [file: string]: number[] };

function similarityToOutput(sim: Similarity): TypeDuplicate['group'] {
  switch (sim) {
    case Similarity.Identical:
      return 'identical';
    case Similarity.HasIdenticalProperties:
      return 'renamed';
    default:
      return 'different';
  }
}

export function clustersToOutput(
  types: SourceCandidateType[],
  clusters: Clusters,
  lengths: FileLengths,
): TypeDuplicate[] {
  const res = Object.entries(clusters).reduce(
    (res, [group, clusters]) =>
      concat(
        res,
        clusters.map((idxs) => ({
          names: chooseClusterNames(types, idxs),
          files: chooseClusterFiles(types, idxs, lengths),
          group: similarityToOutput(+group as Similarity),
          ...chooseTypeFeatures(types, idxs),
        })),
      ),
    [] as TypeDuplicate[],
  );
  return res;
}
