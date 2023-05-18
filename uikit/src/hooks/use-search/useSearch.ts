import { always } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import { Facet, FacetStats, Filter, Search } from './search.js';

export type UseSearch<Data> = {
  reindex: (data: Data[]) => void;
  update: (query: string, filter: Filter<Data>) => void;
  updateQuery: (query: string) => void;
  results: Data[];
  facetsStats: FacetStats;
};

export function useSearch<Data>(
  facets: Facet<Data>[],
  initialQuery: string,
  filter: Filter<Data>,
): UseSearch<Data> {
  const search = useMemo(() => Search({ facets }), []);
  const [results, setResults] = useState([] as Data[]);
  const [facetsStats, setFacetsStats] = useState({} as FacetStats);
  const [query, setQuery] = useState(initialQuery);

  const updateResults = useCallback(
    (query: string, filter: Filter<Data>) => {
      const { results, facetsStats } = search.search(query, filter);
      setResults(results);
      setFacetsStats(facetsStats);
    },
    [search],
  );

  const update = useCallback(
    (query: string, filter: Filter<Data>) => {
      setQuery(query);
      // setFilter(filter);
      updateResults(query, filter);
    },
    [updateResults],
  );

  const updateQuery = useCallback(
    (query: string) => {
      setQuery(query);
      updateResults(query, always(true));
    },
    [updateResults],
  );

  // const updateFilter = useCallback(
  //   (partialFilter: Partial<Filter>) => {
  //     setFilter(newFilter);
  //     updateResults(query, newFilter);
  //   },
  //   [query, filter, updateResults],
  // );

  const reindex = useCallback(
    (data: Data[]) => {
      search.refresh(data);
      update(query, filter);
    },
    [query, filter, update, search],
  );

  return {
    reindex,
    update,
    updateQuery,
    results,
    facetsStats,
  };
}
