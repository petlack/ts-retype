import { TypeDuplicate } from '../../src/types';
import {
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  UnionCandidateType,
} from '../../src/types/candidate';

export type Cluster = Pick<TypeDuplicate, 'files' | 'names'>;

export type LiteralTypeCluster = Omit<LiteralCandidateType, 'pos' | 'lines'> &
  Pick<TypeDuplicate, 'group'> &
  Cluster;
export type FunctionTypeCluster = Omit<FunctionCandidateType, 'pos' | 'lines'> &
  Pick<TypeDuplicate, 'group'> &
  Cluster;
export type EnumTypeCluster = Omit<EnumCandidateType, 'pos' | 'lines'> &
  Pick<TypeDuplicate, 'group'> &
  Cluster;
export type UnionTypeCluster = Omit<UnionCandidateType, 'pos' | 'lines'> &
  Pick<TypeDuplicate, 'group'> &
  Cluster;

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
