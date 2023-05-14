import { useCallback, useMemo, useState } from 'react';
import MiniSearch from 'minisearch';

export function useMiniSearch<Data>() {
  const miniSearch = new MiniSearch({
    fields: ['label', 'type'],
    storeFields: ['label', 'type'],
    searchOptions: { prefix: true },
  });

  let allData: Data[] = [];

  return {
    refresh(data: Data[]) {
      miniSearch.removeAll();
      miniSearch.addAll(data);
      allData = data;
    },
    search(query: string) {
      let results = allData;
      if (query.trim().length > 0) {
        results = miniSearch.search(query, {
          fuzzy: true,
          prefix: true,
        }) as unknown as Data[];
      }

      return {
        results,
      };
    },
  };
}

type UpdateQueryFn = (query: string) => void;
type ReindexFn<T> = (data: T[]) => void;

export function useSearch<Data>(initialQuery: string): {
  query: string;
  setQuery: UpdateQueryFn;
  results: Data[];
  reindex: ReindexFn<Data>;
} {
  const search = useMemo(() => useMiniSearch<Data>(), []);
  const [results, setResults] = useState([] as Data[]);
  const [query, setQuery] = useState(initialQuery);

  const updateResults = useCallback(
    (query: string) => {
      const { results } = search.search(query);
      setResults(results);
    },
    [search],
  );

  const update = useCallback(
    (query: string) => {
      setQuery(query);
      updateResults(query);
    },
    [updateResults],
  );

  const updateQuery = useCallback(
    (query: string) => {
      setQuery(query);
      updateResults(query);
    },
    [updateResults],
  );

  const reindex = useCallback(
    (data: Data[]) => {
      search.refresh(data);
      update(query);
    },
    [query, update, search],
  );

  return { query, results, setQuery: updateQuery, reindex };
}
