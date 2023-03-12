import { useEffect, useState } from 'react';

import { useSearch } from './hooks/useSearch';
import { ClusterListing } from './components/Cluster';
import { Empty } from './components/Empty';
import { Filters } from './components/Filters';
import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/Toast';
import { Facet, fulltext } from './model/search';
import { TypeCluster } from './types';

import './App.scss';

const facets: Facet<TypeCluster>[] = [
  { name: 'similarity', values: ['all', 'Identical', 'HasIdenticalProperties'], matches: (rec, v) => v === 'all' && ['Identical', 'HasIdenticalProperties'].includes(rec.group) || rec.group === v },
  { name: 'type', values: ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'], matches: (rec, v) => v === 'all' || rec.type === v },
];

function App() {
  const [allData, setAllData] = useState([] as TypeCluster[]);

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
      window.__data__.reduce((res, { name, clusters }) => [
        ...res,
        ...(
          clusters.map(cluster => ({
            ...cluster,
            id: ++id,
            group: name,
            fulltext: fulltext(cluster as TypeCluster),
          }))
        )
      ], [] as TypeCluster[])
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
