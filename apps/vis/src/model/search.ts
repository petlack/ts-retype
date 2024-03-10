import { Facet, facetStats } from './facet.js';
import { Filter } from './filter.js';
import { FulltextData } from '../types.js';
import MiniSearch from 'minisearch';

export function fulltext(duplicate: FulltextData): string {
    return [
        `${duplicate.names.map(({ name }) => name)}`,
        `${Object.keys(duplicate.names).join(' ')}`,
        `${duplicate.files.map(({ file }) => file).join(' ')}`,
        `${(duplicate.properties || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.parameters || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.members || []).join(' ')}`,
        `${(duplicate.types || []).join(' ')}`,
    ].join(' ');
}

export type SearchProps<T> = {
  facets: Facet<T, unknown>[];
};

export function Search<T>({ facets }: SearchProps<T>) {
    const miniSearch = new MiniSearch({
        fields: ['name', 'fulltext'],
        storeFields: [
            'name',
            'type',
            'names',
            'files',
            'properties',
            'parameters',
            'returnType',
            'group',
            'fulltext',
        ],
    });

    let allData: T[] = [];

    return {
        refresh(data: T[]) {
            miniSearch.removeAll();
            miniSearch.addAll(data);
            allData = data;
        },
        search(query: string, filter: Filter) {
            let results = allData;
            if (query.trim().length > 0) {
                results = miniSearch.search(query, {
                    fuzzy: true,
                    prefix: true,
                }) as unknown as T[];
            }

            const data = filter.filter(results as FulltextData[]);
            const facetsStats = facetStats(data as T[], facets);

            return {
                results: data,
                facetsStats,
            };
        },
    };
}
