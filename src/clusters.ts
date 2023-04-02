import { parse } from './parse';
import {
  CandidateType,
  SourceCandidateType,
  LiteralCandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  UnionCandidateType,
} from './types';
import ts from 'typescript';

function toSourceCandidateTypes(file: string, types: CandidateType[]): SourceCandidateType[] {
  return types.map((t) => ({ ...t, file }));
}

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
  const lengths = srcFile
    .getFullText()
    .split('\n')
    .map((l) => l.length);
  const candidateTypes = parse(srcFile);
  const types = toSourceCandidateTypes(relPath, candidateTypes).filter(nonEmptyCandidateType);
  return { types, lengths };
}
