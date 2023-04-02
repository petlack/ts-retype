import { ascend, assoc, sort, zip } from 'ramda';
import ts, { LiteralTypeNode } from 'typescript';
import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  ICandidateType,
  LiteralCandidateType,
  Property,
  UnionCandidateType,
} from './types';

import { toName } from './utils';

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
        name: (getNodeText(sourceFile, p.name) || '<unknown>').trim(),
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

function getNodeText(sourceFile: ts.SourceFile, node: ts.TypeNode) {
  return node ? sourceFile.getFullText().substring(node.pos, node.end) : 'unknown';
}

function parseCandidate(sourceFile: ts.SourceFile, node: any): CandidateType | undefined | false {
  switch (node.kind) {
    case ts.SyntaxKind.InterfaceDeclaration: {
      const name: string = node.name.escapedText;
      const candidate = getLiteralType(name, 'interface', sourceFile, node, [node.pos, node.end]);
      return candidate;
    }
    case ts.SyntaxKind.EnumDeclaration: {
      const name = node.name.escapedText;
      const candidate = getEnumType(name, sourceFile, node, [node.pos, node.end]);
      return candidate;
    }
    case ts.SyntaxKind.FunctionDeclaration: {
      const fn = node as ts.FunctionDeclaration;
      const name = fn.name?.escapedText || 'anonymous';
      const candidate = getFunctionType(name, sourceFile, node, [fn.pos, fn.end]);
      return candidate;
    }
    case ts.SyntaxKind.TypeAliasDeclaration: {
      if (!node.type) {
        return false;
      }
      switch (node.type.kind) {
        case ts.SyntaxKind.FunctionType: {
          const name = node.name.escapedText;
          const candidate = getFunctionType(name, sourceFile, node.type, [node.pos, node.end]);
          return candidate;
        }
        case ts.SyntaxKind.UnionType: {
          const name = node.name.escapedText;
          const candidate = getUnionType(name, sourceFile, node.type, [node.pos, node.end]);
          return candidate;
        }
        default: {
          if (node.type && node.type.members) {
            const name = node.name.escapedText;
            const child = node.type;
            const candidate = parseCandidate(sourceFile, child);
            return (
              candidate && {
                ...candidate,
                name,
                pos: [node.pos, node.end],
              }
            );
            // const name: string = node.name.escapedText;
            // // const child = node.children[0];
            // const candidate = getLiteralType(name, 'alias', sourceFile, node.type, [
            //   node.pos,
            //   node.end,
            // ]);
            // return candidate;
          }
        }
      }
      return false;
    }
    case ts.SyntaxKind.TypeLiteral: {
      const name = 'anonymous';
      const candidate = getLiteralType(name, 'literal', sourceFile, node, [node.pos, node.end]);
      return candidate;
    }
    case ts.SyntaxKind.UnionType: {
      const candidate = getUnionType('anonymous', sourceFile, node, [node.pos, node.end]);
      return candidate;
    }
  }
}

export function getAllCandidates(sourceFile: ts.SourceFile) {
  const all: CandidateType[] = [];
  const visitor = (node: any) => {
    // console.log(node.kind, toName(node));
    // console.log(getNodeText(sourceFile, node));
    const candidate = parseCandidate(sourceFile, node);
    if (candidate) {
      all.push(candidate);
    }
    return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    // return false;
  };
  visitTopLevelDeclarations(sourceFile, visitor);
  return all;
}

function visitTopLevelDeclarations(
  sourceFile: ts.Node,
  visitor: (node: ts.Node, level: number) => boolean,
) {
  const visit = function (node: ts.Node, level: number) {
    const skip = visitor(node, level);
    if (skip) {
      ts.forEachChild(node, (parent) => {
        ts.forEachChild(parent, (child) => visit(child, level + 2));
      });
    } else {
      ts.forEachChild(node, (node) => visit(node, level + 1));
    }
  };
  visit(sourceFile, 0);
}

export function removeAliasDuplicates(candidates: CandidateType[]): CandidateType[] {
  const all = candidates.map(CandidateType);
  const aliases = all.filter((c) => c.is('alias'));
  const ofTypes = aliases
    .map((alias) =>
      sort(
        ascend((oftype) =>
          !oftype.equals(alias) && oftype.startsAfter(alias) && oftype.endsBefore(alias)
            ? oftype.srcLength()
            : -1,
        ),
        all,
      ).at(-1),
    )
    .filter((c) => c);
  const ofTypesIds = ofTypes.map((c) => c?.id());
  const aliasById = zip(aliases, ofTypes).reduce(
    (res, [alias, ofType]) =>
      alias && ofType
        ? assoc(
            alias.id(),
            CandidateType({
              ...ofType.self,
              type: ofType.self.type,
              name: alias.self.name,
              pos: alias.self.pos,
            }),
            res,
          )
        : res,
    {} as { [key: string]: ICandidateType },
  );
  // .filter(c => c)
  // .reduce((res, item) => item ? ({
  //   ...res,
  //   [item.id()]: item,
  // }) : res, {} as { [key: string]: ICandidateType });
  // console.log(JSON.stringify({ all, aliases, ofTypes, aliasById }, null, 2));
  return all.filter((c) => !ofTypesIds.includes(c.id())).map((c) => (aliasById[c.id()] || c).self);
}

export function parse(sourceFile: ts.SourceFile) {
  const candidates = getAllCandidates(sourceFile);
  return removeAliasDuplicates(candidates);
}
