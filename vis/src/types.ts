import {
  CandidateType,
  ClusterOutput,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  Similarity,
  SourceFile,
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

export type CandidateTypeCluster =
  | FunctionTypeCluster
  | LiteralTypeCluster
  | EnumTypeCluster
  | UnionTypeCluster;

export type TypeCluster = Pick<CandidateType, 'type' | 'name' | 'pos'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
  properties?: LiteralCandidateType['properties'];
  parameters?: FunctionCandidateType['parameters'];
  returnType?: FunctionCandidateType['returnType'];
  members?: EnumCandidateType['members'];
  types?: UnionCandidateType['types'];
};

export type LiteralTypeCluster = Pick<LiteralCandidateType, 'type' | 'name' | 'properties'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type FunctionTypeCluster = Pick<
  FunctionCandidateType,
  'type' | 'name' | 'parameters' | 'returnType'
> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type EnumTypeCluster = Pick<EnumCandidateType, 'type' | 'name' | 'members'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type UnionTypeCluster = Pick<UnionCandidateType, 'type' | 'name' | 'types'> & {
  files: SourceFile[];
  names: Freq;
  group: string;
};

export type Data = Omit<ClusterOutput, 'group'> & { group: string };
export type FulltextData = Data & { id: number; fulltext: string };
export type SimilarityGroup = ClusterOutput;
