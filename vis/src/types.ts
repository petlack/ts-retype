import {
  ClusterOutput,
  EnumCandidateType,
  Freq,
  FunctionCandidateType,
  LiteralCandidateType,
  SourceFile,
  UnionCandidateType,
} from '../../src/types';

export type Cluster = {
  files: SourceFile[];
  names: Freq;
  group: string;
  pos: [number, number];
};

export type LiteralTypeCluster = LiteralCandidateType & Cluster;
export type FunctionTypeCluster = FunctionCandidateType & Cluster;
export type EnumTypeCluster = EnumCandidateType & Cluster;
export type UnionTypeCluster = UnionCandidateType & Cluster;

export type Data = Omit<ClusterOutput, 'group'> & { group: string; pos: [number, number] };
export type FulltextData = Data & { id: number; fulltext: string };
