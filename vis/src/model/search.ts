import MiniSearch from 'minisearch';
import { assocPath, path, pluck, zip } from 'ramda';
import { FulltextData } from '../types.js';

export type Filter = {
  selectedSimilarity: string;
  selectedType: string;
  minFiles: number;
  minProperties: number;
};

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

export function combinations<T>(values: T[][]): T[][] {
  if (values.length === 0) {
    return [];
  }

  const [first, ...rest] = values;
  const combinationsRest = combinations(rest);

  if (combinationsRest.length === 0) {
    return first.map((item) => [item]);
  }

  return first.flatMap((item) => combinationsRest.map((combination) => [item, ...combination]));
}

function combineFacets<R>(facets: Facet<R>[], values: (string | number)[]) {
  return (d: R) =>
    zip(facets, values).reduce((res, [facet, value]) => res && facet.matches(d, value), true);
}

export function facetStats<T>(data: T[], facets: Facet<T>[]): FacetStats {
  const combs = combinations(pluck('values', facets));
  let res: FacetStats = {};
  for (const facetValues of combs) {
    res = assocPath(facetValues, data.filter(combineFacets(facets, facetValues)).length, res);
  }
  return res;
}

export function getFacetStat(obj: FacetStats, ...rest: (string | number)[]): number {
  return <number>path(rest, obj) || 0;
}

export type FacetStats = { [facetName: string]: number | FacetStats };
export type Facet<R> = {
  name: string;
  values: (string | number)[];
  matches: (record: R, value: string | number) => boolean;
};

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

      const filteredResults = results.filter(
        ({ files, properties = [], parameters = [], members = [], types = [] }) =>
          properties.length + parameters.length + members.length + types.length >=
            filter.minProperties && files.length >= filter.minFiles,
      );

      const data = filteredResults.filter(
        combineFacets(facets, [filter.selectedSimilarity, filter.selectedType]),
      );

      const facetsStats = facetStats(filteredResults, facets);

      return {
        results: data,
        facetsStats,
      };
    },
  };
}
