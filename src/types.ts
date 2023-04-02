import { equals } from 'ramda';

export interface Property {
  name: string;
  type: string;
  text?: string;
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

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

// export type RetypeOutput = {
//   output: string;
//   json?: string;
//   noHtml?: boolean;
// }

// export type RetypeProject = {
//   project: string;
// }

// export type RetypeCmd = {
//   config?: string;
//   generate?: boolean | string | null;
// }

// export type RetypeArgs = RetypeConfig & RetypeProject;

// export type RetypeOptions = RetypeArgs & RetypeOutput & RetypeCmd;

// export type RetypeConfig = {
//   exclude: string[];
//   include: string[];
//   output: string;
//   json?: string;
//   noHtml?: boolean;
// };

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
    generate: boolean;
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
  generate: false,
  include: ['**/*.{ts,tsx}'],
  json: null,
  noHtml: false,
  output: './retype-report.html',
};

export type TypeDuplicate = {
  files: {
    file: string;
    lines: [number, number];
    pos: [number, number];
    type: CandidateType['type'];
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
  types?: string[];
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
