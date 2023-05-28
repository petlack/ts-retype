import { Facet, fulltext } from './model/search.js';
import { Filters, FiltersMenu } from './components/Filters/index.js';
import { Footer } from './components/Footer/Footer.js';
import { FulltextData } from './types.js';
import { Listing } from './components/Listing/index.js';
import { useBoolean, useSearch, SearchPhraseProvider } from '@ts-retype/uikit/hooks';
import { Box, Button, Drawer, Hamburger, Logo, Search, ThemeProvider, ThemeToggle, ToastProvider, Topbar } from '@ts-retype/uikit';
import { TooltipRoot } from './hooks/useTooltip/TooltipRoot.js';
import type { Metadata, TypeDuplicate } from '@ts-retype/retype';
import { decompressRoot } from '@ts-retype/retype/dist/snippet.js';
import { themes } from './themes.js';
import { useCallback, useEffect, useState } from 'react';
import { Flex, Heading } from '@theme-ui/components';
import { theme } from './ts-theme.js';
import { FaTimes } from 'react-icons/fa';

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
  const [isDrawerOpen, toggleDrawer] = useBoolean(false);
  // const [query, setQuery] = useState('');
  // const initialFilter = { minFiles: 2, minProperties: 3, selectedSimilarity: 'all', selectedType: 'all' };
  const initialFilter = () => true;

  const {
    // query,
    // filter = {},
    results,
    // facetsStats,
    // updateQuery,
    setQuery,
    query,
    // updateFilter,
    reindex,
  } = useSearch<FulltextData>(['fulltext'], ['files', 'names', 'group'], '');

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
        <ToastProvider />
        <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
          <Box sx={{ bg: 'primary', height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
            <Heading as='h2'>Sidebar</Heading>
            <Button onClick={toggleDrawer} rightIcon={<FaTimes />}>Close</Button>
            <ThemeToggle />
          </Box>
        </Drawer>

        <Topbar sx={{ flex: 1 }}>
          <Flex sx={{ gap: 4, py: 1, px: 2 }}>
            <Logo name='retype' />
            <Search
              query={query}
              setQuery={setQuery}
            />
            <Button
              colorScheme='primary'
              fill='ghost'
              size='lg'
              leftIcon={<Hamburger isOpen={isDrawerOpen} flavor='cross' />}
              onClick={toggleDrawer}
              sx={{
                position: 'fixed',
                right: 0,
                top: 0,
                zIndex: 50,
              }}
            />

          </Flex>
          <div className="main">
            <Listing
              meta={meta}
              results={results}
              filter={{ minFiles: 0, selectedType: '', minProperties: 0, selectedSimilarity: '' }}
            />
            <Footer meta={meta} />
          </div>
          <TooltipRoot />
        </Topbar>
      </SearchPhraseProvider>
    </ThemeProvider >
  );
}

export default App;
