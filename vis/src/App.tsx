import { useCallback, useEffect, useState } from 'react';
import { Facet, fulltext } from './model/search';
import { Filters, FiltersMenu } from './components/Filters';
import { Footer } from './components/Footer/Footer';
import { FulltextData } from './types';
import { Listing } from './components/Listing';
import { Metadata } from '../../src/types';
import { Search } from './components/Search';
import { SearchPhraseProvider } from './hooks/useSearchPhrase';
import { ToastProvider } from './components/Toast';
import { TooltipRoot } from './hooks/useTooltip/TooltipRoot';
import { TopBar } from '../../docs/src/uikit/TopBar';
import { UiKitApp } from '../../docs/src/uikit/UiKitApp';
import { useSearch } from './hooks/useSearch';
import { ThemeProvider, ThemeMode } from '../../uikit/src/theme/provider';

import './App.scss';

const accent = '#0a799e';
const second = '#c68726';
const body = 'sans-serif';
const heading = 'sans-serif';
const mono = 'monospace';
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

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

function App() {
  const [allData, setAllData] = useState([] as FulltextData[]);
  const [meta, setMeta] = useState({} as Metadata);
  const [themeName, setThemeName] = useState<ThemeMode>(preferredTheme);

  const [
    query,
    filter,
    results,
    facetsStats,
    updateQuery,
    updateFilter,
    reindex,
  ] = useSearch(facets, { minFiles: 2, minProperties: 3, selectedSimilarity: 'all', selectedType: 'all' }, '');
  
  useEffect(() => {
    setAllData(
      window.__data__.filter(({ group }) => ['identical', 'renamed'].includes(group))
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

  const toggleTheme = useCallback(() => {
    const nextTheme = {
      light: 'dark' as ThemeMode,
      dark: 'light' as ThemeMode,
    };
    setThemeName(nextTheme[themeName]);
  }, [themeName]);

  return (
    <ThemeProvider accent={accent} second={second} mode={themeName} { ...{ body, heading, mono } }>
      <UiKitApp theme={themeName}>
        <SearchPhraseProvider value={{ phrase: query }}>
          <ToastProvider>
            <TopBar>
              <Search
                query={query}
                setQuery={updateQuery}
              />
              <button style={{ marginRight: '60px' }} onClick={toggleTheme}>click</button>
              <FiltersMenu isOpen={filtersVisible} onClick={toggleFiltersVisibility} />
              <Filters
                filter={filter}
                updateFilter={updateFilter}
                facetsStats={facetsStats}
                visible={filtersVisible}
              />
            </TopBar>
            <div className="main">
              <Listing
                meta={meta}
                results={results}
                filter={filter}
              />
              <Footer meta={meta} />
            </div>
          </ToastProvider>
          <TooltipRoot />
        </SearchPhraseProvider>
      </UiKitApp>
    </ThemeProvider>
  );
}

export default App;
