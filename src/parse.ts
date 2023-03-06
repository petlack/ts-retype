import ts from 'typescript';
import { LiteralType, Property } from './types';

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
        key: getNodeText(sourceFile, node.parameters[0].type).trim(),
        value: getNodeText(sourceFile, node.type).trim(),
        type: toName(node.type),
      };
  }
  return null;
}

export function getAllLiteralTypes(sourceFile: ts.SourceFile) {
  const all: LiteralType[] = [];
  visitTopLevelDeclarations(sourceFile, function (node: any) {
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration: {
        const name: string = node.name.escapedText;
        const interfaceProperties: Property[] = node.members
          .map((child: any) => {
            const signature = getNodeSignature(sourceFile, child);
            return signature;
          })
          .filter((x: Property | null) => !!x);
        all.push({ name, pos: [node.pos, node.end], properties: interfaceProperties });
        return true;
      }
      case ts.SyntaxKind.TypeAliasDeclaration: {
        if (node.type && node.type.members) {
          const name: string = node.name.escapedText;
          const typeProperties: Property[] = node.type.members
            .map((child: any) => {
              const signature = getNodeSignature(sourceFile, child);
              return signature;
            })
            .filter((x: Property | null) => !!x);

          all.push({ name, pos: [node.pos, node.end], properties: typeProperties });
          return true;
        } else {
          return false;
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
        all.push({ name: 'anonymous', pos: [node.pos, node.end], properties: children });
        return true;
      }
      default:
        return false;
    }
  });
  return all;
}
