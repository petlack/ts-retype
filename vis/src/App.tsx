import { useEffect, useState } from 'react';

import { useSearch } from './hooks/useSearch';
import { ClusterListing } from './components/Cluster';
import { Empty } from './components/Empty';
import { Filters } from './components/Filters';
import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/Toast';
import { Facet, fulltext } from './model/search';
import { FulltextData } from './types';

import './App.scss';
import { Similarity } from '../../src/types';

const facets: Facet<FulltextData>[] = [
  {
    name: 'similarity',
    values: ['all', 'Identical', 'HasIdenticalProperties'],
    matches: (rec, v) => v === 'all' &&
      ['Identical', 'HasIdenticalProperties'].includes(rec.group) ||
      rec.group === v,
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

  const resultsMarkup = results.length === 0 ?
    <Empty /> :
    <ClusterListing clusters={results} query={query} />;

  return (
    <div id="app">
      <ToastProvider>
        <Navbar
          query={query}
          setQuery={updateQuery}
        />
        <div className="main">
          <Filters
            filter={filter}
            updateFilter={updateFilter}
            facetsStats={facetsStats}
          />
          <div className="listing">
            {resultsMarkup}
          </div>
        </div>
      </ToastProvider>
    </div>
  );
}

export default App;
