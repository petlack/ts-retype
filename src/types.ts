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
};

export type TypeCluster = Pick<LiteralType, 'name' | 'properties'> & {
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
  clusters: TypeCluster[];
};

export type RetypeConfig = {
  exclude: string[];
  include: string[];
  output: string;
}

export type RetypeArgs = RetypeConfig & {
  project: string;
}

export type RetypeOptions = RetypeArgs & {
  config?: string;
}

export const DEFAULT_OPTIONS: RetypeConfig = {
  output: './retype-report.html',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**', '**/generated/**'],
};