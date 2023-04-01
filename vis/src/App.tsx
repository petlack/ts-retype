import { useCallback, useEffect, useState } from 'react';
import { Facet, fulltext } from './model/search';
import { Filters, FiltersMenu } from './components/Filters';
import { FulltextData } from './types';
import { Listing } from './components/Listing';
import { Search } from './components/Search';
import { Similarity } from '../../src/types';
import { ToastProvider } from './components/Toast';
import { TopBar } from '../../docs/src/uikit/TopBar';
import { UiKitApp } from '../../docs/src/uikit/UiKitApp';
import { useSearch } from './hooks/useSearch';

import './App.scss';
import { SearchPhraseProvider } from './hooks/useSearchPhrase';

const theme = 'light';
// const theme = 'dark';
// const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

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

  const [
    query,
    filter,
    results,
    facetsStats,
    updateQuery,
    updateFilter,
    reindex,
  ] = useSearch(facets, { minFiles: 2, minProperties: 3, selectedTab: 'all', selectedType: 'all' }, '');
  
  useEffect(() => {
    let id = 0;
    setAllData(
      window.__data__.map(cluster => ({
        ...cluster,
        group: cluster.group as keyof typeof Similarity,
        id: ++id,
        fulltext: fulltext(cluster as FulltextData),
      }))
    );
  }, []);
  
  useEffect(() => {
    reindex(allData);
  }, [allData]);

  const [filtersVisible, setFiltersVisible] = useState(false);

  const toggleFiltersVisibility = useCallback(() => {
    setFiltersVisible(!filtersVisible);
  }, [filtersVisible]);

  return (
    <UiKitApp theme={theme}>
      <SearchPhraseProvider value={{ phrase: query }}>
        <ToastProvider>
          <TopBar>
            <Search
              query={query}
              setQuery={updateQuery}
            />
            <FiltersMenu onClick={toggleFiltersVisibility} />
          </TopBar>
          <div className="main">
            <Filters
              filter={filter}
              updateFilter={updateFilter}
              facetsStats={facetsStats}
              visible={filtersVisible}
            />
            <Listing
              results={results}
              query={query}
            />
          </div>
        </ToastProvider>
      </SearchPhraseProvider>
    </UiKitApp>
  );
}

export default App;
