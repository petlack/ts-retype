import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';

type WithAll<T> = T | 'all';

export type FulltextData = TypeDuplicate & { id: number; fulltext: string };

export const SIMILARITIES: WithAll<TypeDuplicate['group']>[] = [
    'all', 'identical', 'renamed',
];

export const CANDIDATE_TYPES: WithAll<ArrayElement<TypeDuplicate['files']>['type']>[] = [
    'all',
    'alias',
    'enum',
    'function',
    'interface',
    'literal',
    'union',
];
