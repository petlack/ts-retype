import { FulltextData } from './types';
import { Search, Snippet } from '@ts-retype/uikit';
import { useEffect } from 'react';
import { Duplicate } from './components/Duplicate';
import { Listing } from './components/Listing';
import { useSearch } from './hooks/useSearch';
import { useData } from './hooks/useData';
import './App.css';

function App() {
    const { data: allData, meta } = useData();

    const {
        // filter = {},
        // facetsStats,
        // updateFilter,
        query,
        reindex,
        results,
        setQuery,
    } = useSearch<FulltextData>(['fulltext'], ['files', 'names', 'group'], '');

    const initialFilter = {
        minFiles: 2,
        minProperties: 3,
        selectedSimilarity: 'all',
        selectedType: 'all',
    };

    const filter = initialFilter;

    useEffect(() => {
        reindex(allData);
    }, [allData, reindex]);

    if (!allData?.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Search
                query={query}
                setQuery={setQuery}
            />
            <Listing
                meta={meta}
                results={results}
                filter={filter}
            />
            <Duplicate {...allData[0]} />
            <Snippet title="Meta">{JSON.stringify(meta)}</Snippet>
            <Snippet title="Data">{JSON.stringify(allData)}</Snippet>
        </>
    );
}

export default App;
