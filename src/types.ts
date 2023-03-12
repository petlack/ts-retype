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

export interface SourceCandidateType extends CandidateType {
  file: string;
}

export type SourceFile = {
  pos: [number, number];
  lines: number[];
  file: string;
};

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

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
