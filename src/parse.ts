import ts from 'typescript';
import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  LiteralType,
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

function getNodeSignature(sourceFile: ts.SourceFile, node: any) {
  switch (node.kind) {
    case ts.SyntaxKind.PropertySignature:
      return {
        key: node.name.escapedText,
        value: getNodeText(sourceFile, node.type).trim(),
        type: toName(node.type),
      };
    case ts.SyntaxKind.IndexSignature:
      return {
        key: getNodeText(sourceFile, node.parameters[0] && node.parameters[0].type).trim(),
        value: getNodeText(sourceFile, node.type).trim(),
        type: toName(node.type),
      };
  }
  return null;
}

export function getAllCandidateTypes(sourceFile: ts.SourceFile) {
  const all: CandidateType[] = [];
  visitTopLevelDeclarations(sourceFile, function (node: any) {
    // console.log('visit', ts.SyntaxKind[node.kind], ts.SyntaxKind[node.type && node.type.kind]);
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration: {
        const name: string = node.name.escapedText;
        const interfaceProperties: Property[] = (node.members || [])
          .map((child: any) => {
            const signature = getNodeSignature(sourceFile, child);
            return signature;
          })
          .filter((x: Property | null) => !!x);
        const candidate: LiteralType = {
          name,
          type: 'interface',
          pos: [node.pos, node.end],
          properties: interfaceProperties,
        };
        all.push(candidate);
        return true;
      }
      case ts.SyntaxKind.EnumDeclaration: {
        const name = node.name.escapedText;
        const members = (node.members || []).map((m: any) => m.name.escapedText);
        const candidate: EnumCandidateType = {
          name,
          type: 'enum',
          pos: [node.pos, node.end],
          members,
        };
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
            const types = (node.type.types || [])
              .filter(
                (t: any) =>
                  t.kind === ts.SyntaxKind.LiteralType &&
                  t.literal.kind === ts.SyntaxKind.StringLiteral,
              )
              .map((t: any) =>
                getNodeText(sourceFile, t)
                  .trim()
                  .replace(/^"+|"+$/g, '')
                  .replace(/^'+|'+$/g, ''),
              );
            const candidate: UnionCandidateType = {
              name,
              type: 'union',
              pos: [node.pos, node.end],
              types,
            };
            all.push(candidate);
            return true;
          }
          case ts.SyntaxKind.FunctionType: {
            const name = node.name.escapedText;
            const returnType = getNodeText(sourceFile, node.type.type).trim();
            const parameters = (node.type.parameters || []).map(
              (p: any) =>
                <Property>{
                  key: p.name.escapedText,
                  value: getNodeText(sourceFile, p.type).trim(),
                  type: toName(p.type),
                },
            );
            const candidate: FunctionCandidateType = {
              name,
              type: 'function',
              pos: [node.pos, node.end],
              parameters,
              returnType,
            };
            all.push(candidate);
            return false;
          }
          default: {
            if (node.type && node.type.members) {
              const name: string = node.name.escapedText;
              const typeProperties: Property[] = (node.type.members || [])
                .map((child: any) => {
                  const signature = getNodeSignature(sourceFile, child);
                  return signature;
                })
                .filter((x: Property | null) => !!x);
              const candidate: LiteralType = {
                name,
                type: 'alias',
                pos: [node.pos, node.end],
                properties: typeProperties,
              };
              all.push(candidate);
              return true;
            } else {
              return false;
            }
          }
        }
      }
      case ts.SyntaxKind.TypeLiteral: {
        const children: Property[] = [];
        ts.forEachChild(node, (child) => {
          const signature = getNodeSignature(sourceFile, child);
          if (signature) {
            children.push(signature);
          }
        });
        const candidate: LiteralType = {
          name: 'anonymous',
          type: 'literal',
          pos: [node.pos, node.end],
          properties: children,
        };
        all.push(candidate);
        return true;
      }
      case ts.SyntaxKind.UnionType: {
        const types = (node.types || [])
          .filter(
            (t: any) =>
              t.kind === ts.SyntaxKind.LiteralType &&
              t.literal.kind === ts.SyntaxKind.StringLiteral,
          )
          .map((t: any) =>
            getNodeText(sourceFile, t)
              .trim()
              .replace(/^"+|"+$/g, '')
              .replace(/^'+|'+$/g, ''),
          );
        const candidate: UnionCandidateType = {
          name: 'anonymous',
          type: 'union',
          pos: [node.pos, node.end],
          types,
        };
        all.push(candidate);
        return false;
      }
    }
    return false;
  });
  return all;
}
