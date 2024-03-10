import { Button, Drawer, Hamburger, Search } from '@ts-retype/uikit';
import { useEffect, useMemo, useState } from 'react';
import { Controls } from './components/Controls';
import { Filter } from './model/filter';
import type { FulltextData } from './types';
import { Listing } from './components/Listing';
import { SearchPhraseProvider } from '@ts-retype/uikit/hooks';
import { clsx } from '@ts-retype/uikit/clsx';
import { useBoolean } from '@ts-retype/uikit/hooks';
import { useData } from './hooks/useData';
import { useSearch } from './hooks/useSearch';

export function App() {
    const {
        value: isDrawerOpen,
        toggle: toggleDrawer,
        setFalse: closeDrawer,
    } = useBoolean(false);
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

    const themeStyle = 'clrs-light clrs-core clrs-sx';

    return (
        <div className={clsx(
            themeStyle,
            'flex flex-col items-center',
            'bg-default text-default'
        )}>
            <SearchPhraseProvider value={{ phrase: query }}>
                <Drawer
                    isOpen={isDrawerOpen}
                    onClose={closeDrawer}
                    disableScrollingWhenOpen={false}
                >
                    <div className={clsx(
                        themeStyle,
                        'flex flex-col',
                        'bg-default text-default',
                        'rounded-bl-lg rounded-tl-lg',
                        'shadow-xl',
                        'mt-14',
                        'gap-4 p-6',
                    )}>
                        <Controls
                            filter={filter}
                            setFilter={setFilter}
                            stats={stats}
                        />
                    </div>
                </Drawer>
                <Button
                    data-state={isDrawerOpen ? 'open' : 'closed'}
                    className={clsx(
                        'fixed right-1 top-1',
                        'z-50',
                        'aspect-square',
                        'bg-default text-accent-500',
                        'hover:bg-accent-500 hover:text-white',
                        'transition',
                    )}
                    onClick={toggleDrawer}
                >
                    <Hamburger isOpen={isDrawerOpen} flavor='cross' />
                </Button>

                <div className={clsx(
                    'flex flex-row justify-center',
                    'w-[80vw] max-w-[120ch]',
                    'py-4',
                )}>
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
