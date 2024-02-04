import type { TypeDuplicate } from '@ts-retype/search/types';

export type FulltextData = TypeDuplicate & { id: number; fulltext: string };

export const SIMILARITIES = ['all', 'identical', 'renamed'];
export const CANDIDATE_TYPES = [
    'all',
    'alias',
    'enum',
    'function',
    'interface',
    'literal',
    'union',
];
