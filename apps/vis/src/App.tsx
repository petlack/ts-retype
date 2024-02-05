import { FulltextData } from './types';
import { Listing } from './components/Listing';
import { Button } from '@ts-retype/uikit';
import { Search } from '@ts-retype/uikit';
import { SearchPhraseProvider } from '@ts-retype/uikit';
import { useEffect } from 'react';
import { useSearch } from './hooks/useSearch';
import { useData } from './hooks/useData';

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

    useEffect(() => reindex(allData), [allData, reindex]);

    if (!allData?.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <SearchPhraseProvider value={{ phrase: query }}>
                <Button
                    className="fixed right-0 top-0"
                    onClick={() => console.log('foo')}
                >Hit</Button>
                <div className="flex flex-row justify-center py-4">
                    <Search
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
                <Listing
                    meta={meta}
                    results={results}
                    filter={filter}
                />
            </SearchPhraseProvider>
        </>
    );
}

export default App;
