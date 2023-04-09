import {
  TypeDuplicate,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  UnionCandidateType,
  // ArrayElement,
} from '../../src/types';

export type Cluster = Pick<TypeDuplicate, 'files' | 'names'>;

export type LiteralTypeCluster = Omit<LiteralCandidateType, 'pos' | 'lines'> & Cluster;
export type FunctionTypeCluster = Omit<FunctionCandidateType, 'pos' | 'lines'> & Cluster;
export type EnumTypeCluster = Omit<EnumCandidateType, 'pos' | 'lines'> & Cluster;
export type UnionTypeCluster = Omit<UnionCandidateType, 'pos' | 'lines'> & Cluster;

export type Data = Omit<TypeDuplicate, 'group'> & {
  group: string;
};
export type FulltextData = Data & { id: number; fulltext: string };

export const SIMILARITIES = ['all', 'identical', 'renamed'];
export const CANDIDATE_TYPES = [
  'all',
  'alias',
  'enum',
  'function',
  'interface',
  'literal',
  'union',
];
