import { useCallback, useEffect, useRef, useState } from 'react';
import MiniSearch from 'minisearch';

export function createMiniSearch<Data>(fields: string[], storeFields: string[]) {
    const miniSearch = new MiniSearch({
        fields,
        storeFields,
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

export function useSearch<Data>(
    fields: string[],
    storeFields: string[],
    initialQuery: string,
): {
  query: string;
  setQuery: UpdateQueryFn;
  results: Data[];
  reindex: ReindexFn<Data>;
} {
    const minisearch = useRef(
        createMiniSearch<Data>(fields, storeFields),
    );
    const [results, setResults] = useState([] as Data[]);
    const [query, setQuery] = useState(initialQuery);

    const updateResults = useCallback(
        (query: string) => {
            const { results } = minisearch.current.search(query);
            setResults(results);
        },
        [minisearch],
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
            minisearch.current.refresh(data);
            update(query);
        },
        [query, update, minisearch],
    );

    useEffect(() => {
        updateResults(query);
    }, [query, updateResults]);

    return { query, results, setQuery: updateQuery, reindex };
}
