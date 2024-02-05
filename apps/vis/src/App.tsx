import { Button } from '@ts-retype/uikit';
import { Drawer } from '@ts-retype/uikit';
import { FulltextData } from './types';
import { Listing } from './components/Listing';
import { Search } from '@ts-retype/uikit';
import { SearchPhraseProvider } from '@ts-retype/uikit/hooks';
import { useBoolean } from '@ts-retype/uikit/hooks';
import { useData } from './hooks/useData';
import { useEffect } from 'react';
import { useSearch } from './hooks/useSearch';

function App() {
    const [isDrawerOpen, toggleDrawer, _, closeDrawer] = useBoolean(false);
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
        <div className="clrs-light clrs-core clrs-sx">
            <SearchPhraseProvider value={{ phrase: query }}>
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <div className="bg-accent-300 gap-4 p-4 h-full">
                        <h2>Sidebar</h2>
                    </div>
                </Drawer>
                <Button
                    className="fixed right-0 top-0"
                    onClick={toggleDrawer}
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
        </div>
    );
}

export default App;
