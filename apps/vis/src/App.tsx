import { Button, Drawer, Search } from '@ts-retype/uikit';
import { useEffect, useMemo, useState } from 'react';
import { Code } from '@ts-retype/uikit/code';
import { Controls } from './components/Controls';
import { Filter } from './model/filter';
import type { FulltextData } from './types';
import { Listing } from './components/Listing';
import { SearchPhraseProvider } from '@ts-retype/uikit/hooks';
import { clsx } from '@ts-retype/uikit/clsx';
import { useBoolean } from '@ts-retype/uikit/hooks';
import { useData } from './hooks/useData';
import { useSearch } from './hooks/useSearch';

function App() {
    const [isDrawerOpen, toggleDrawer, _, closeDrawer] = useBoolean(false);
    const { data: allData, meta } = useData();

    const { query, reindex, results, setQuery, } = useSearch<FulltextData>(
        ['fulltext'],
        ['name', 'type', 'names', 'files', 'properties', 'parameters', 'returnType', 'group'],
        '',
    );

    const [filter, setFilter] = useState(Filter.empty());

    const [data, stats] = useMemo(() => {
        if (!results) return [[], {}];
        const data = filter.filter(results);
        const stats = filter.stats(data);
        return [data, stats];
    }, [filter, results]);

    useEffect(() => reindex(allData), [allData, reindex]);

    if (!allData?.length) {
        return <div>Loading...</div>;
    }

    const themeStyle = clsx(
        'clrs-light clrs-core clrs-sx',
    );

    return (
        <div className={clsx(
            themeStyle,
            'flex flex-col items-center',
        )}>
            <SearchPhraseProvider value={{ phrase: query }}>
                <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <div className={clsx(
                        themeStyle,
                        'bg-default text-default',
                        'gap-4 p-4 min-h-full',
                    )}>
                        <h2>Sidebar</h2>
                        <Controls
                            filter={filter}
                            setFilter={setFilter}
                            stats={stats}
                        />
                        <Code>{JSON.stringify(filter, null, 2)}</Code>
                        <Code>{JSON.stringify(stats, null, 2)}</Code>
                    </div>
                </Drawer>
                <Button
                    className="fixed right-0 top-0"
                    onClick={toggleDrawer}
                >Hit</Button>
                <div className="flex flex-row justify-center py-4 w-[80vw] max-w-[120ch]">
                    <Search
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
                <div className="p-4 max-w-[120ch] self-center">
                    <Listing
                        meta={meta}
                        results={data}
                        filter={filter}
                    />
                </div>
            </SearchPhraseProvider>
        </div>
    );
}

export default App;
