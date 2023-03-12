import { useCallback, useMemo, useState } from 'react';
import { Facet, FacetStats, Filter, Search } from '../model/search';
import { TypeCluster } from '../types';

type UpdateQueryFn = (query: string) => void;
type UpdateFilterFn = (filter: Partial<Filter>) => void;
type ReindexFn<T> = (data: T[]) => void;

export function useSearch(
  facets: Facet<TypeCluster>[],
  initialFilter: Filter,
  initialQuery: string,
): [
  string,
  Filter,
  TypeCluster[],
  FacetStats,
  UpdateQueryFn,
  UpdateFilterFn,
  ReindexFn<TypeCluster>,
] {
  const search = useMemo(() => Search({ facets }), []);
  const [results, setResults] = useState([] as TypeCluster[]);
  const [facetsStats, setFacetsStats] = useState({} as FacetStats);
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(initialFilter);

  const updateResults = useCallback(
    (query: string, filter: Filter) => {
      const { results, facetsStats } = search.search(query, filter);
      setResults(results);
      setFacetsStats(facetsStats);
    },
    [search],
  );

  const update = useCallback(
    (query: string, filter: Filter) => {
      setQuery(query);
      setFilter(filter);
      updateResults(query, filter);
    },
    [updateResults],
  );

  const updateQuery = useCallback(
    (query: string) => {
      setQuery(query);
      updateResults(query, filter);
    },
    [filter, updateResults],
  );

  const updateFilter = useCallback(
    (partialFilter: Partial<Filter>) => {
      const newFilter = {
        ...filter,
        ...partialFilter,
      };
      setFilter(newFilter);
      updateResults(query, newFilter);
    },
    [query, filter, updateResults],
  );

  const reindex = useCallback(
    (data: TypeCluster[]) => {
      search.refresh(data);
      update(query, filter);
    },
    [query, filter, update, search],
  );

  return [query, filter, results, facetsStats, updateQuery, updateFilter, reindex];
}
