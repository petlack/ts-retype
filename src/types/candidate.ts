import { equals } from 'ramda';
import { TypeDuplicate } from './duplicate';
import { ArrayElement } from './utils';

export interface Property {
  name: string;
  type: string;
  text?: string;
}

export interface CandidateType {
  name: string;
  type: ArrayElement<TypeDuplicate['files']>['type'];
  offset: ArrayElement<TypeDuplicate['files']>['offset'];
  pos: ArrayElement<TypeDuplicate['files']>['pos'];
  lines: ArrayElement<TypeDuplicate['files']>['lines'];
  src: ArrayElement<TypeDuplicate['files']>['src'];
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

export interface SourceCandidateType extends CandidateType {
  file: string;
  src: string;
  srcHgl: any;
}

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
