import { Button, Code, Drawer, InputNumber, Search } from '@ts-retype/uikit';
import { useEffect, useMemo, useState } from 'react';
import { Filter } from './model/filter';
import type { FulltextData } from './types';
import { Listing } from './components/Listing';
import { SearchPhraseProvider } from '@ts-retype/uikit/hooks';
import { useBoolean } from '@ts-retype/uikit/hooks';
import { useData } from './hooks/useData';
import { useSearch } from './hooks/useSearch';

function App() {
    const [isDrawerOpen, toggleDrawer, _, closeDrawer] = useBoolean(true);
    const { data: allData, meta } = useData();

    const {
        query,
        reindex,
        results,
        setQuery,
    } = useSearch<FulltextData>(['fulltext'], ['files', 'names', 'group'], '');

    const [filter, setFilter] = useState(Filter.empty());

    const [data, stats] = useMemo(() => {
        if (!results) return [[], []];
        const data = filter.filter(results);
        const stats = filter.stats(data);
        return [data, stats];
    }, [filter, results]);

    useEffect(() => reindex(allData), [allData, reindex]);

    if (!allData?.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="clrs-light clrs-core clrs-sx">
            <SearchPhraseProvider value={{ phrase: query }}>
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <div className="bg-default text-default gap-4 p-4 h-full">
                        <h2>Sidebar</h2>
                        <InputNumber
                            value={filter.minFiles || 1}
                            onChange={minFiles => setFilter(filter.setMinFiles(minFiles))}
                            min={1}
                        />
                        <InputNumber
                            value={filter.minProperties || 1}
                            onChange={minProperties => setFilter(filter.setMinProperties(minProperties))}
                            min={1}
                        />
                    </div>
                </Drawer>
                <Button
                    className="fixed right-0 top-0"
                    onClick={toggleDrawer}
                >Hit</Button>
                <Code>{JSON.stringify(stats, null, 2)}</Code>
                <div className="flex flex-row justify-center py-4">
                    <Search
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
                <Listing
                    meta={meta}
                    results={data}
                    filter={filter}
                />
            </SearchPhraseProvider>
        </div>
    );
}

export default App;
