import { parse } from './parse';
import { Similarity, IClusters } from './types/similarity';
import ts from 'typescript';
import { freq, selectIndices } from './utils';
import { pluck, uniq } from 'ramda';
import { highlight } from './source';
import { TypeDuplicate } from '.';
import {
  CandidateType,
  LiteralCandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
  SourceCandidateType,
  Property,
} from './types/candidate';

function nonEmptyCandidateType(type: CandidateType): boolean {
  switch (type.type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return (<LiteralCandidateType>type).properties.length > 0;
    case 'enum':
      return (<EnumCandidateType>type).members.length > 0;
    case 'function':
      return (<FunctionCandidateType>type).parameters.length > 0;
    case 'union':
      return (<UnionCandidateType>type).types.length > 0;
  }
}

export function getTypesInFile(srcFile: ts.SourceFile, relPath: string) {
  function toSourceCandidateTypes(file: string, types: CandidateType[]): SourceCandidateType[] {
    return types.map((t) => {
      const src =
        t.type === 'function'
          ? (t as FunctionCandidateType).signature?.strFull || '() => {}'
          : t.src;
      // const src = getCodeSnippet(srcFile, { pos: t.pos[0], end: t.pos[1] });
      return {
        ...t,
        file,
        srcHgl: highlight(src),
        src,
      };
    });
  }
  const lengths = srcFile
    .getFullText()
    .split('\n')
    .map((l) => l.length);
  const candidateTypes = parse(srcFile);
  const types = toSourceCandidateTypes(relPath, candidateTypes).filter(nonEmptyCandidateType);
  return { types, lengths };
}

function chooseClusterNames(types: SourceCandidateType[], idxs: Iterable<number>) {
  return freq(pluck('name', selectIndices(types, idxs)));
}

function chooseClusterFiles(types: SourceCandidateType[], idxs: Iterable<number>) {
  return selectIndices(types, idxs);
}

function propertyToOutput(prop: Property): Property {
  return {
    name: prop.name,
    type: prop.type,
  };
}

function chooseTypeFeatures(types: SourceCandidateType[], idxs: Iterable<number>) {
  const selected = selectIndices(types, idxs);
  const selectedTypes = uniq(pluck('type', selected));
  // if (selectedTypes.length > 1) {
  //   console.log('warning: multiple types in a similarity group');
  // }
  const type = selectedTypes[0];
  switch (type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return {
        properties: (selected[0] as unknown as LiteralCandidateType).properties.map(
          propertyToOutput,
        ),
      };
    case 'enum':
      return {
        members: (selected[0] as unknown as EnumCandidateType).members,
      };
    case 'function':
      return {
        parameters: (selected[0] as unknown as FunctionCandidateType).parameters.map(
          propertyToOutput,
        ),
        returnType: (selected[0] as unknown as FunctionCandidateType).returnType,
      };
    case 'union':
      return {
        types: (selected[0] as unknown as UnionCandidateType).types,
      };
  }
}

function similarityToDuplicateGroup(sim: Similarity): TypeDuplicate['group'] {
  switch (sim) {
    case Similarity.Identical:
      return 'identical';
    case Similarity.HasIdenticalProperties:
      return 'renamed';
    default:
      return 'different';
  }
}

export function clustersToDuplicates(
  types: SourceCandidateType[],
  clusters: IClusters<Similarity>,
): TypeDuplicate[] {
  const res = clusters.flatMap(
    (group, idxs) =>
      ({
        names: chooseClusterNames(types, idxs),
        files: chooseClusterFiles(types, idxs),
        group: similarityToDuplicateGroup(+group as Similarity),
        ...chooseTypeFeatures(types, idxs),
      } as TypeDuplicate),
  );
  return res;
}
