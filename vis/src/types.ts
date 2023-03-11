import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  UnionCandidateType,
} from '../../src/types';

export type Freq = {
  [k in string | number | symbol]: number;
};

export interface Property {
  key: string;
  value: string;
  type: string;
}

export interface LiteralType {
  name: string;
  properties: Property[];
  pos: [number, number];
}

export interface SourceLiteralType extends LiteralType {
  file: string;
}

export type SourceFile = {
  pos: [number, number];
  lines: number[];
  file: string;
  type: CandidateType['type'];
};

export type CandidateTypeCluster = FunctionTypeCluster &
  LiteralTypeCluster &
  EnumTypeCluster &
  UnionTypeCluster;

export type TypeCluster = Pick<LiteralType, 'name' | 'properties'> & {
  files: SourceFile[];
  type: 'alias' | 'interface' | 'literal' | 'function';
  names: Freq;
  group: string;
};

export type LiteralTypeCluster = Pick<LiteralCandidateType, 'name' | 'type' | 'properties'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type FunctionTypeCluster = Pick<
  FunctionCandidateType,
  'name' | 'type' | 'parameters' | 'returnType'
> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type EnumTypeCluster = Pick<EnumCandidateType, 'name' | 'type' | 'members'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type UnionTypeCluster = Pick<UnionCandidateType, 'name' | 'type' | 'types'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

export type Data = { name: string; clusters: TypeCluster[] };
export type SimilarityGroup = {
  name: string;
  clusters: TypeCluster[];
};
