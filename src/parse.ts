import ts, { LiteralTypeNode } from 'typescript';
import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralCandidateType,
  Property,
  UnionCandidateType,
} from './types';

import { toName } from './utils';

function visitTopLevelDeclarations(sourceFile: ts.SourceFile, visitor: any) {
  const visit = function (node: any, level: number) {
    const stop = visitor(node, level);
    if (stop) {
      return;
    }
    ts.forEachChild(node, (node) => visit(node, level + 1));
  };
  visit(sourceFile, 0);
}

function getNodeText(sourceFile: ts.SourceFile, node: ts.TypeNode) {
  return node ? sourceFile.getFullText().substring(node.pos, node.end) : 'unknown';
}

function getPropertySignature(sourceFile: ts.SourceFile, node: any): Property | null {
  switch (node.kind) {
    case ts.SyntaxKind.PropertySignature:
      return {
        name: node.name.escapedText,
        type: getNodeText(sourceFile, node.type).trim(),
        text: toName(node.type),
      };
    case ts.SyntaxKind.IndexSignature:
      return {
        name: getNodeText(sourceFile, node.parameters[0] && node.parameters[0].type).trim(),
        type: getNodeText(sourceFile, node.type).trim(),
        text: toName(node.type),
      };
  }
  return null;
}

function getLiteralType(
  name: string,
  type: LiteralCandidateType['type'],
  sourceFile: ts.SourceFile,
  node: ts.TypeLiteralNode,
  pos: [number, number],
): LiteralCandidateType {
  const children = (node.members || [])
    .map((child) => {
      const signature = getPropertySignature(sourceFile, child);
      return signature;
    })
    .filter((x: Property | null) => !!x) as Property[];
  const candidate: LiteralCandidateType = {
    name,
    type,
    pos,
    properties: children,
  };
  return candidate;
}
function getFunctionType(
  name: string,
  sourceFile: ts.SourceFile,
  node: ts.FunctionTypeNode,
  pos: [number, number],
) {
  const returnType = getNodeText(sourceFile, node.type).trim();
  const parameters = (node.parameters || []).map(
    (p: any) =>
      <Property>{
        name: p.name.escapedText || '<unknown>',
        type: getNodeText(sourceFile, p.type).trim(),
        text: toName(p.type),
      },
  );
  const candidate: FunctionCandidateType = {
    name,
    type: 'function',
    pos,
    parameters,
    returnType,
  };
  return candidate;
}

function getUnionType(
  name: string,
  sourceFile: ts.SourceFile,
  node: ts.UnionTypeNode,
  pos: [number, number],
) {
  const types = (node.types || [])
    .filter(
      (t) =>
        t.kind === ts.SyntaxKind.LiteralType &&
        (<LiteralTypeNode>t).literal.kind === ts.SyntaxKind.StringLiteral,
    )
    .map((t) =>
      getNodeText(sourceFile, t)
        .trim()
        .replace(/^"+|"+$/g, '')
        .replace(/^'+|'+$/g, ''),
    );
  const candidate: UnionCandidateType = {
    name,
    type: 'union',
    pos,
    types,
  };
  return candidate;
}

function getEnumType(
  name: string,
  _sourceFile: ts.SourceFile,
  node: ts.EnumDeclaration,
  pos: [number, number],
) {
  const members = (node.members || []).map((m: any) => m.name.escapedText);
  const candidate: EnumCandidateType = {
    name,
    type: 'enum',
    pos,
    members,
  };
  return candidate;
}

export function getAllCandidateTypes(sourceFile: ts.SourceFile) {
  const all: CandidateType[] = [];
  visitTopLevelDeclarations(sourceFile, function (node: any) {
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration: {
        const name: string = node.name.escapedText;
        const candidate = getLiteralType(name, 'interface', sourceFile, node, [node.pos, node.end]);
        all.push(candidate);
        return true;
      }
      case ts.SyntaxKind.EnumDeclaration: {
        const name = node.name.escapedText;
        const candidate = getEnumType(name, sourceFile, node, [node.pos, node.end]);
        all.push(candidate);
        return true;
      }
      case ts.SyntaxKind.TypeAliasDeclaration: {
        if (!node.type) {
          return false;
        }
        switch (node.type.kind) {
          case ts.SyntaxKind.UnionType: {
            const name = node.name.escapedText;
            const candidate = getUnionType(name, sourceFile, node.type, [node.pos, node.end]);
            all.push(candidate);
            return true;
          }
          case ts.SyntaxKind.FunctionType: {
            const name = node.name.escapedText;
            const candidate = getFunctionType(name, sourceFile, node.type, [node.pos, node.end]);
            all.push(candidate);
            return false;
          }
          default: {
            if (node.type && node.type.members) {
              const name: string = node.name.escapedText;
              const candidate = getLiteralType(name, 'alias', sourceFile, node.type, [
                node.pos,
                node.end,
              ]);
              all.push(candidate);
              return true;
            } else {
              return false;
            }
          }
        }
      }
      case ts.SyntaxKind.TypeLiteral: {
        const name = 'anonymous';
        const candidate = getLiteralType(name, 'literal', sourceFile, node, [node.pos, node.end]);
        all.push(candidate);
        return true;
      }
      case ts.SyntaxKind.UnionType: {
        const candidate = getUnionType('anonymous', sourceFile, node, [node.pos, node.end]);
        all.push(candidate);
        return false;
      }
    }
    return false;
  });
  return all;
}
