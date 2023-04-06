import { parse } from './parse';
import {
  CandidateType,
  SourceCandidateType,
  LiteralCandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
  Property,
  Similarity,
  TypeDuplicate,
  Clusters,
} from './types';
import ts from 'typescript';
import { freq, getNodeText, selectIndices } from './utils';
import { concat, pluck, uniq } from 'ramda';

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

function fixIndentation(src: string) {
  let indentLevel = 0;
  const INDENT_SIZE = 2;
  const INDENT = ' '.repeat(INDENT_SIZE);

  const lines = src.split('\n');
  return lines
    .map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) {
        return '';
      }

      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')')) {
        indentLevel--;
      }

      const indent = INDENT.repeat(indentLevel);
      const indentedLine = `${indent}${trimmedLine}`;

      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('(')) {
        indentLevel++;
      }

      return indentedLine;
    })
    .join('\n');
}

export function getTypesInFile(srcFile: ts.SourceFile, relPath: string) {
  function toSourceCandidateTypes(file: string, types: CandidateType[]): SourceCandidateType[] {
    return types.map((t) => ({
      ...t,
      file,
      src:
        t.type === 'function'
          ? (t as FunctionCandidateType).signature?.strMin || '() => {}'
          : fixIndentation(getNodeText(srcFile, { pos: t.pos[0], end: t.pos[1] })),
    }));
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
  return selectIndices(types, idxs).map((t) => ({
    file: t.file,
    type: t.type,
    pos: t.pos,
    src: t.src,
    lines: t.lines,
  }));
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
        types: (types[0] as unknown as UnionCandidateType).types,
      };
  }
}

function similarityToOutput(sim: Similarity): TypeDuplicate['group'] {
  switch (sim) {
    case Similarity.Identical:
      return 'identical';
    case Similarity.HasIdenticalProperties:
      return 'renamed';
    default:
      return 'different';
  }
}

export function clustersToOutput(
  types: SourceCandidateType[],
  clusters: Clusters,
): TypeDuplicate[] {
  const res = Object.entries(clusters).reduce(
    (res, [group, clusters]) =>
      concat(
        res,
        clusters.map((idxs) => ({
          names: chooseClusterNames(types, idxs),
          files: chooseClusterFiles(types, idxs),
          group: similarityToOutput(+group as Similarity),
          ...chooseTypeFeatures(types, idxs),
        })),
      ),
    [] as TypeDuplicate[],
  );
  return res;
}
