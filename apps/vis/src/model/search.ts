import { Filter } from './filter.js';
import MiniSearch from 'minisearch';
import { FulltextData } from '../types.js';
import { Facet, combineFacets, facetStats } from './facet.js';

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

export type SearchProps = {
  facets: Facet<FulltextData>[];
};

export function Search({ facets }: SearchProps) {
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

    let allData: FulltextData[] = [];

    return {
        refresh(data: FulltextData[]) {
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
                }) as unknown as FulltextData[];
            }

            const data = filter.filter(results);
            const facetsStats = facetStats(data, facets);

            return {
                results: data,
                facetsStats,
            };
        },
    };
}
