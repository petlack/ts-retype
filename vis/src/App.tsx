import { Facet, fulltext } from './model/search';
import { Filters, FiltersMenu } from './components/Filters';
import { Footer } from './components/Footer/Footer';
import { FulltextData } from './types';
import { Listing } from './components/Listing';
// import { Search } from './components/Search';
import { SearchPhraseProvider, useSearch } from '@ts-retype/uikit/hooks';
import { Search, ToastProvider, ThemeMode, ThemeProvider } from '@ts-retype/uikit';
import { Sidebar, SidebarMenu } from '@ts-retype/uikit';
// import { ToastProvider } from './components/Toast';
import { TooltipRoot } from './hooks/useTooltip/TooltipRoot';
import { TopBar, UiKitApp } from '@ts-retype/uikit';
import type { Metadata, TypeDuplicate } from '@ts-retype/retype';
import { decompressRoot } from '@ts-retype/retype/dist/snippet';
import { themes } from './themes';
import { useCallback, useEffect, useState } from 'react';
// import { useSearch } from './hooks/useSearch';

import '@ts-retype/uikit/dist/index.css';
import './App.scss';

const preferredTheme: ThemeMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const facets: Facet<FulltextData>[] = [
  {
    name: 'similarity',
    values: ['all', 'identical', 'renamed'],
    matches: (rec, v) => v === 'all' ||
      rec.group === v && rec.group !== 'different',
  },
  {
    name: 'type',
    values: ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'],
    matches: (rec, v) => v === 'all' || !!rec.files.find(({ type }) => type === v),
  },
];

function decompress(td: TypeDuplicate) {
  return {
    ...td,
    files: td.files.map(file => ({
      ...file,
      srcHgl: decompressRoot(file.srcHgl),
    })),
  };
}

function App() {
  const [allData, setAllData] = useState([] as FulltextData[]);
  const [meta, setMeta] = useState({} as Metadata);
  // const [query, setQuery] = useState('');
  // const initialFilter = { minFiles: 2, minProperties: 3, selectedSimilarity: 'all', selectedType: 'all' };
  const initialFilter = () => true;

  const {
    // query,
    filter = {},
    results,
    facetsStats,
    updateQuery,
    setQuery,
    query,
    updateFilter,
    reindex,
  } = useSearch(['fulltext'], ['files', 'names', 'group'], '');

  useEffect(() => {
    setAllData(
      window.__data__.map(decompress).filter(({ group }) => ['identical', 'renamed'].includes(group))
        .map((duplicate, idx) => ({
          ...duplicate,
          id: idx,
          fulltext: fulltext(duplicate as FulltextData),
        }))
    );
    setMeta(window.__meta__);
  }, []);

  useEffect(() => {
    reindex(allData);
  }, [allData]);

  const [filtersVisible, setFiltersVisible] = useState(false);

  const toggleFiltersVisibility = useCallback(() => {
    setFiltersVisible(!filtersVisible);
  }, [filtersVisible]);

  // <FiltersMenu isOpen={filtersVisible} onClick={toggleFiltersVisibility} />
  // <Filters
  //   filter={filter}
  //   updateFilter={updateFilter}
  //   facetsStats={facetsStats}
  //   visible={filtersVisible}
  // />
  return (
    <ThemeProvider theme={themes[preferredTheme]}>
      <UiKitApp>
        <SearchPhraseProvider value={{ phrase: query }}>
          <Sidebar />
          <ToastProvider>
            <TopBar>
              <Search
                query={query}
                setQuery={setQuery}
              />
              <SidebarMenu />
            </TopBar>
            <div className="main">
              <Listing
                meta={meta}
                results={results}
                filter={filter}
              />
              <Footer meta={meta} />
            </div>
            <TooltipRoot />
          </ToastProvider>
        </SearchPhraseProvider>
      </UiKitApp>
    </ThemeProvider>
  );
}

export default App;
