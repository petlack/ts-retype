import { ascend, assoc, sort, zip } from 'ramda';
import ts, { LiteralTypeNode, SignatureDeclaration } from 'typescript';
import { functionSignatureToStr } from './source';
import {
  CandidateType,
  EnumCandidateType,
  FunctionCandidateType,
  ICandidateType,
  LiteralCandidateType,
  Property,
  UnionCandidateType,
} from './types/candidate';

import { getNodeText, toName } from './utils';

function getNodePos(srcFile: ts.SourceFile, node: ts.Node): CandidateType['pos'] {
  return [node.getStart(srcFile), node.getEnd()];
}

function getNodeLines(srcFile: ts.SourceFile, node: ts.Node): CandidateType['lines'] {
  return [
    srcFile.getLineAndCharacterOfPosition(node.getStart(srcFile)).line + 1,
    srcFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1,
  ];
}

function getPropertySignature(srcFile: ts.SourceFile, node: any): Property | null {
  switch (node.kind) {
    case ts.SyntaxKind.PropertySignature:
      return {
        name: node.name.escapedText,
        type: getNodeText(srcFile, node.type).trim(),
        text: toName(node.type),
      };
    case ts.SyntaxKind.IndexSignature:
      return {
        name: getNodeText(srcFile, node.parameters[0] && node.parameters[0].type).trim(),
        type: getNodeText(srcFile, node.type).trim(),
        text: toName(node.type),
      };
  }
  return null;
}

function getLiteralType(
  name: string,
  type: LiteralCandidateType['type'],
  srcFile: ts.SourceFile,
  node: ts.TypeLiteralNode,
): LiteralCandidateType {
  const children = (node.members || [])
    .map((child) => {
      const signature = getPropertySignature(srcFile, child);
      return signature;
    })
    .filter((x: Property | null) => !!x) as Property[];
  const candidate: LiteralCandidateType = {
    name,
    type,
    pos: getNodePos(srcFile, node),
    lines: getNodeLines(srcFile, node),
    properties: children,
  };
  return candidate;
}

function functionSignature(
  srcFile: ts.SourceFile,
  node: ts.FunctionTypeNode,
): FunctionCandidateType['signature'] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = (node.name?.escapedText as string) || '';
  const params = node.parameters.map((param) => ({
    name: getNodeText(srcFile, param.name).trim(),
    type: (param.type && getNodeText(srcFile, param.type).trim()) || 'any',
  }));
  const ret = (node.type && getNodeText(srcFile, node.type).trim()) || 'any';

  // return `${fnName ? name : ''}(${params.map(({ name, type }) => paramName ? `${name}: ${type}` : type).join(', ')}) => ${ret}`;
  const sig = {
    name,
    params,
    return: ret,
    strMin: functionSignatureToStr({ name, params, return: ret }),
    strFull: functionSignatureToStr(
      { name, params, return: ret },
      { fnName: true, paramName: true },
    ),
  } as FunctionCandidateType['signature'];
  return sig;
}

function getFunctionType(name: string, srcFile: ts.SourceFile, node: ts.FunctionTypeNode) {
  const returnType = getNodeText(srcFile, node.type).trim();
  const parameters = (node.parameters || []).map(
    (p: any) =>
      <Property>{
        name: (getNodeText(srcFile, p.name) || '<unknown>').trim(),
        type: getNodeText(srcFile, p.type).trim(),
        text: toName(p.type),
      },
  );
  const candidate: FunctionCandidateType = {
    name,
    type: 'function',
    pos: getNodePos(srcFile, node),
    lines: getNodeLines(srcFile, node),
    parameters,
    returnType,
    signature: functionSignature(srcFile, node),
  };
  return candidate;
}

function getUnionType(name: string, srcFile: ts.SourceFile, node: ts.UnionTypeNode) {
  const types = (node.types || [])
    .filter(
      (t) =>
        t.kind === ts.SyntaxKind.LiteralType &&
        (<LiteralTypeNode>t).literal.kind === ts.SyntaxKind.StringLiteral,
    )
    .map((t) =>
      getNodeText(srcFile, t)
        .trim()
        .replace(/^"+|"+$/g, '')
        .replace(/^'+|'+$/g, ''),
    );
  const candidate: UnionCandidateType = {
    name,
    type: 'union',
    pos: getNodePos(srcFile, node),
    lines: getNodeLines(srcFile, node),
    types,
  };
  return candidate;
}

function getEnumType(name: string, srcFile: ts.SourceFile, node: ts.EnumDeclaration) {
  const members = (node.members || []).map((m: any) => m.name.escapedText);
  const candidate: EnumCandidateType = {
    name,
    type: 'enum',
    pos: getNodePos(srcFile, node),
    lines: getNodeLines(srcFile, node),
    members,
  };
  return candidate;
}

function parseCandidate(srcFile: ts.SourceFile, node: any): CandidateType | undefined | false {
  switch (node.kind) {
    case ts.SyntaxKind.InterfaceDeclaration: {
      const name: string = node.name.escapedText;
      const candidate = getLiteralType(name, 'interface', srcFile, node);
      return candidate;
    }
    case ts.SyntaxKind.EnumDeclaration: {
      const name = node.name.escapedText;
      const candidate = getEnumType(name, srcFile, node);
      return candidate;
    }
    case ts.SyntaxKind.FunctionDeclaration: {
      const fn = node as SignatureDeclaration;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const name = fn.name?.escapedText || 'anonymous';
      const candidate = getFunctionType(name, srcFile, node);
      return candidate;
    }
    case ts.SyntaxKind.TypeAliasDeclaration: {
      if (!node.type) {
        return false;
      }
      switch (node.type.kind) {
        case ts.SyntaxKind.FunctionType: {
          const name = node.name.escapedText;
          const candidate = getFunctionType(name, srcFile, node.type);
          return candidate;
        }
        case ts.SyntaxKind.UnionType: {
          const name = node.name.escapedText;
          const candidate = getUnionType(name, srcFile, node.type);
          return candidate;
        }
        default: {
          if (node.type && node.type.members) {
            const name = node.name.escapedText;
            const child = node.type;
            const candidate = parseCandidate(srcFile, child);
            return (
              candidate && {
                ...candidate,
                name,
              }
            );
            // const name: string = node.name.escapedText;
            // // const child = node.children[0];
            // const candidate = getLiteralType(name, 'alias', srcFile, node.type, [
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
      const candidate = getLiteralType(name, 'literal', srcFile, node);
      return candidate;
    }
    case ts.SyntaxKind.UnionType: {
      const candidate = getUnionType('anonymous', srcFile, node);
      return candidate;
    }
  }
}

export function getAllCandidates(srcFile: ts.SourceFile) {
  const all: CandidateType[] = [];
  const visitor = (node: any) => {
    // console.log(node.kind, toName(node));
    // console.log(getNodeText(srcFile, node));
    const candidate = parseCandidate(srcFile, node);
    if (candidate) {
      all.push(candidate);
    }
    return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    // return false;
  };
  visitTopLevelDeclarations(srcFile, visitor);
  return all;
}

function visitTopLevelDeclarations(
  srcFile: ts.Node,
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
  visit(srcFile, 0);
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

export function parse(srcFile: ts.SourceFile) {
  const candidates = getAllCandidates(srcFile);
  return removeAliasDuplicates(candidates);
}
