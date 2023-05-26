import { Facet, fulltext } from './model/search';
import { Filters, FiltersMenu } from './components/Filters';
import { Footer } from './components/Footer/Footer';
import { FulltextData } from './types';
import { Listing } from './components/Listing';
// import { Search } from './components/Search';
import { SearchPhraseProvider, useSearch } from '@ts-retype/uikit/hooks';
import { Search, SidebarLayout, ToastProvider, ThemeProvider, Logo, Box, Button } from '@ts-retype/uikit';
// import { ToastProvider } from './components/Toast';
import { TooltipRoot } from './hooks/useTooltip/TooltipRoot';
import { Topbar, UiKitApp } from '@ts-retype/uikit';
import type { Metadata, TypeDuplicate } from '@ts-retype/retype';
import { decompressRoot } from '@ts-retype/retype/dist/snippet';
import { themes } from './themes';
import { useCallback, useEffect, useState } from 'react';
import { Flex, Heading } from '@theme-ui/components';
// import { useSearch } from './hooks/useSearch';
import { theme } from './ts-theme';

import '@ts-retype/uikit/dist/index.css';
import './App.scss';

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
    // <ThemeProvider theme={themes[preferredTheme]}>
    <ThemeProvider theme={theme}>
      <SearchPhraseProvider value={{ phrase: query }}>
        <ToastProvider>
          <SidebarLayout sx={{
            bg: 'mantle',
          }}>
            <Box colorScheme='crust'>
              <Heading>HELLO</Heading>
            </Box>
            <Topbar sx={{ flex: 1 }}>
              <Flex sx={{ gap: 4, p: 1 }}>
                <Logo name='retype' />
                <Search
                  query={query}
                  setQuery={setQuery}
                />
              </Flex>
              <div className="main">
                <Listing
                  meta={meta}
                  results={results}
                  filter={filter}
                />
                <Footer meta={meta} />
              </div>
              <TooltipRoot />
            </Topbar>
          </SidebarLayout>
        </ToastProvider>
      </SearchPhraseProvider>
    </ThemeProvider >
  );
}

export default App;
