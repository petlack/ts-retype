import { isEmpty, symmetricDifference, pluck, intersection } from 'ramda';
import {
    CandidateType,
    Property,
    EnumCandidateType,
    UnionCandidateType,
    FunctionCandidateType,
    LiteralCandidateType,
} from './types/candidate.js';
import type { ISparseMatrix, IClusters } from './types/similarity.js';
import { Clusters, Similarity, SparseMatrix } from './types/similarity.js';

const eqValues = (left: unknown[], right: unknown[]) => isEmpty(symmetricDifference(left, right));

function isLiteralType(t: CandidateType) {
    return ['interface', 'literal'].includes(t.type);
}

function similarityForArray<T extends Property>(left: T[], right: T[]): Similarity {
    const propertiesKeysEqual = eqValues(pluck('name', left), pluck('name', right));
    const propertiesKeysIntersection = intersection(pluck('name', left), pluck('name', right));
    const propertiesTypesEqual = eqValues(pluck('type', left), pluck('type', right));

    if (propertiesKeysEqual && propertiesTypesEqual) {
        return Similarity.HasIdenticalProperties;
    }

    if (propertiesKeysEqual) {
        return Similarity.HasSimilarProperties;
    }

    if (
        propertiesKeysIntersection.length == left.length ||
    propertiesKeysIntersection.length == right.length
    ) {
        return Similarity.HasSubsetOfProperties;
    }

    return Similarity.Different;
}

function simplifyType(type: CandidateType): string {
    if (isLiteralType(type)) {
        return 'literal';
    }
    return type.type;
}

export function similarity(
    leftCandidate: CandidateType,
    rightCandidate: CandidateType,
): Similarity {
    const leftType = simplifyType(leftCandidate);
    const rightType = simplifyType(rightCandidate);
    if (leftType !== rightType) {
        return Similarity.Different;
    }

    if (leftType === 'enum' && rightType === 'enum') {
        const left = <EnumCandidateType>leftCandidate;
        const right = <EnumCandidateType>rightCandidate;
        const namesEqual = left.name === right.name;
        const hasEqualLength = left.members.length === right.members.length;
        const parametersEqual =
      hasEqualLength && intersection(left.members, right.members).length === left.members.length;
        if (namesEqual && parametersEqual) {
            return Similarity.Identical;
        }
        if (parametersEqual) {
            return Similarity.HasIdenticalProperties;
        }
        return Similarity.Different;
    }
    if (leftType === 'union' && rightType === 'union') {
        const left = <UnionCandidateType>leftCandidate;
        const right = <UnionCandidateType>rightCandidate;
        const namesEqual = left.name === right.name;
        const hasEqualLength = left.types.length === right.types.length;
        const parametersEqual =
      hasEqualLength && intersection(left.types, right.types).length === left.types.length;
        if (namesEqual && parametersEqual) {
            return Similarity.Identical;
        }
        if (parametersEqual) {
            return Similarity.HasIdenticalProperties;
        }
        return Similarity.Different;
    }
    if (leftType === 'function' && rightType === 'function') {
        const left = <FunctionCandidateType>leftCandidate;
        const right = <FunctionCandidateType>rightCandidate;
        const namesEqual = left.name === right.name;
        const returnTypesEqual = left.returnType === right.returnType;
        const parametersCountEqual = left.parameters.length === right.parameters.length;
        const parametersTypesEqual = eqValues(
            pluck('type', left.parameters),
            pluck('type', right.parameters),
        );
        const parametersNamesEqual = eqValues(
            pluck('name', left.parameters),
            pluck('name', right.parameters),
        );
        const parametersSimilarity =
      parametersCountEqual && parametersTypesEqual
          ? parametersNamesEqual
              ? Similarity.Identical
              : Similarity.HasIdenticalProperties
          : Similarity.Different;
        const parametersEqual = parametersSimilarity !== Similarity.Different;
        if (returnTypesEqual) {
            if (namesEqual && parametersEqual) {
                return parametersSimilarity;
            }
            if (parametersEqual) {
                return Similarity.HasIdenticalProperties;
            }
        }
        return Similarity.Different;
    }
    if (leftType === 'literal' && rightType === 'literal') {
        const left = <LiteralCandidateType>leftCandidate;
        const right = <LiteralCandidateType>rightCandidate;
        const namesEqual = left.name === right.name;
        const propertiesEqual = similarityForArray(left.properties, right.properties);
        if (namesEqual && propertiesEqual === Similarity.HasIdenticalProperties) {
            return Similarity.Identical;
        }
        return propertiesEqual;
    }
    return Similarity.Different;
}

export function computeSimilarityMatrix(
    types: CandidateType[],
    callback?: (by: number) => void,
): ISparseMatrix<Similarity> {
    const matrix = SparseMatrix({ nil: Similarity.Different });
    const idxs = [...Array(types.length).keys()];
    let batched = 0;
    for (const i of idxs) {
        for (const j of idxs) {
            if (i > j) {
                continue;
            }
            batched += 1;
            batched %= 100;
            if (batched === 0) callback?.(100);
            if (i === j) {
                matrix.set(i, j, Similarity.Identical);
            } else {
                matrix.set(i, j, similarity(types[i], types[j]));
            }
        }
    }
    callback?.(batched === 0 ? 100 : batched);
    return matrix;
}

export function similarityMatrixToClusters(
    matrix: ISparseMatrix<Similarity>,
): IClusters<Similarity> {
    const clusters = Clusters<Similarity>().fromTuples(matrix.toTuples());
    return clusters;
}
