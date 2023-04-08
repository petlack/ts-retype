import { equals } from 'ramda';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface Property {
  name: string;
  type: string;
  text?: string;
}

export interface CandidateType {
  name: string;
  type: ArrayElement<TypeDuplicate['files']>['type'];
  pos: ArrayElement<TypeDuplicate['files']>['pos'];
  lines: ArrayElement<TypeDuplicate['files']>['lines'];
}

export interface FunctionCandidateType extends CandidateType {
  type: 'function';
  parameters: Property[];
  returnType: string;
  signature: TypeDuplicate['signature'];
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

// export type SourceCandidateType = CandidateType &
//   Omit<
//     ArrayElement<TypeDuplicate['files']>,
//     keyof CandidateType
//   >;

// export type SourceCandidateType = CandidateType &
//   Pick<
//     ArrayElement<TypeDuplicate['files']>,
//     'file' | 'src' | 'srcHgl'
//   >;

export interface SourceCandidateType extends CandidateType {
  file: string;
  src: string;
  srcHgl: any;
}

export type Clusters = { [s in Similarity]?: Set<number>[] };

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

export type ScanArgs = {
  exclude: string[];
  include: string[];
  rootDir: string;
};

export type ReportArgs = {
  json: string | null;
  noHtml: boolean;
  output: string;
};

export type RetypeCmdOptions = ScanArgs &
  ReportArgs & {
    init: boolean;
    config: string;
  };

export const DEFAULT_ARGS: Partial<ScanArgs> = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  rootDir: '.',
};

export const DEFAULT_CMD_OPTIONS: Partial<RetypeCmdOptions> = {
  config: './.retyperc',
  exclude: ['**/node_modules/**', '**/dist/**'],
  init: false,
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
};

export interface ICandidateType {
  self: CandidateType;
  id: () => string;
  is: (type: string) => boolean;
  equals: (other: ICandidateType) => boolean;
  startsAfter: (other: ICandidateType) => boolean;
  endsBefore: (other: ICandidateType) => boolean;
  sameEnd(other: ICandidateType): boolean;
  srcLength: () => number;
}

export const CandidateType: (self: CandidateType) => ICandidateType = (self) => {
  return {
    self,
    srcLength() {
      return self.pos[1] - self.pos[0];
    },
    id() {
      return `${self.name}_${self.pos[0]}_${self.pos[1]}`;
    },
    equals(other: ICandidateType) {
      return equals(self.pos, other.self.pos) && self.name === other.self.name;
    },
    sameEnd(other: ICandidateType) {
      return other.self.pos[1] === self.pos[1];
    },
    is(type: string) {
      return self.type === type;
    },
    startsAfter(other: ICandidateType) {
      return self.pos[0] >= other.self.pos[0];
    },
    endsBefore(other: ICandidateType) {
      return self.pos[1] <= other.self.pos[1];
    },
  };
};

export type Metadata = {
  projectName: string;
  projectFilesScanned: number;
  projectLocScanned: number;
  projectTypesScanned: number;
  projectFilesWithTypesDeclarations: number;
  reportSize: number;
  scanDuration: number;
  scannedAt: string;
};

export type TypeDuplicate = {
  files: {
    file: string;
    src: string;
    srcHgl: any;
    lines: [number, number];
    pos: [number, number];
    type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
  }[];
  group: 'different' | 'renamed' | 'identical';
  names: {
    count: number;
    name: string;
  }[];
  members?: string[];
  parameters?: {
    name: string;
    type: string;
  }[];
  properties?: {
    name: string;
    type: string;
  }[];
  returnType?: string;
  signature?: {
    name?: string;
    params: { name: string; type?: string }[];
    return?: string;
    strMin?: string;
    strFull?: string;
  };
  types?: string[];
};
