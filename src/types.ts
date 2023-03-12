export type Freq = {
  [k in string | number | symbol]: number;
};

export interface Property {
  key: string;
  value: string;
  type: string;
}

export interface CandidateType {
  name: string;
  type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
  pos: [number, number];
}

export interface LiteralType extends CandidateType {
  type: 'literal' | 'alias' | 'interface';
  properties: Property[];
}

export interface FunctionCandidateType extends CandidateType {
  type: 'function';
  parameters: Property[];
  returnType: string;
}

export interface UnionCandidateType extends CandidateType {
  type: 'union';
  types: string[];
}

export interface EnumCandidateType extends CandidateType {
  type: 'enum';
  members: string[];
}

export interface LiteralCandidateType extends CandidateType {
  type: 'alias' | 'interface' | 'literal';
  properties: Property[];
}

export interface LiteralType extends CandidateType {
  properties: Property[];
}

export interface SourceLiteralType extends LiteralType {
  file: string;
}

export interface SourceCandidateType extends CandidateType {
  file: string;
}

export type SourceFile = {
  pos: [number, number];
  lines: number[];
  file: string;
};

export type CandidateTypeCluster = Pick<CandidateType, 'name' | 'type'> & {
  files: SourceFile[];
  names: Freq;
};

export type FunctionTypeCluster = CandidateTypeCluster &
  Pick<FunctionCandidateType, 'type' | 'parameters' | 'returnType'>;

export type LiteralTypeCluster = CandidateTypeCluster &
  Pick<LiteralCandidateType, 'type' | 'properties'>;

export type EnumTypeCluster = CandidateTypeCluster & Pick<EnumCandidateType, 'type' | 'members'>;

export type UnionTypeCluster = CandidateTypeCluster & Pick<UnionCandidateType, 'type' | 'types'>;

export type TypeCluster = Pick<LiteralType, 'name' | 'type' | 'properties'> & {
  files: SourceFile[];
  names: Freq;
};

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

export type SimilarityGroup = {
  name: string;
  clusters: CandidateTypeCluster[];
};

export type RetypeConfig = {
  exclude: string[];
  include: string[];
  output: string;
  json?: string;
  noHtml?: boolean;
};

export type RetypeArgs = RetypeConfig & {
  project: string;
};

export type RetypeOptions = RetypeArgs & {
  config?: string;
  generate?: boolean | string | null;
};

export const DEFAULT_OPTIONS: RetypeConfig = {
  output: './retype-report.html',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**', '**/generated/**', '**/build/**'],
  noHtml: false,
};

export type ClusterOutput = {
  name: string;
  type: CandidateType['type'];
  files: SourceFile[];
  names: Freq;
  group: Similarity;
  properties?: LiteralCandidateType['properties'];
  parameters?: FunctionCandidateType['parameters'];
  returnType?: FunctionCandidateType['returnType'];
  members?: EnumCandidateType['members'];
  types?: UnionCandidateType['types'];
};
