import {
  TypeDuplicate,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  UnionCandidateType,
} from '../../src/types';

export type Cluster = Pick<TypeDuplicate, 'files' | 'names' | 'group'> & {
  pos: [number, number];
};

export type LiteralTypeCluster = LiteralCandidateType & Cluster;
export type FunctionTypeCluster = FunctionCandidateType & Cluster;
export type EnumTypeCluster = EnumCandidateType & Cluster;
export type UnionTypeCluster = UnionCandidateType & Cluster;

export type Data = Omit<TypeDuplicate, 'group'> & { group: string; pos: [number, number] };
export type FulltextData = Data & { id: number; fulltext: string };
