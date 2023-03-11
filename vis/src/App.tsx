import { useEffect, useState } from 'react';

import { ClusterListing } from './components/Cluster';
import { Empty } from './components/Empty';
import { Filters } from './components/Filters';
import { Navbar } from './components/Navbar';
import { fulltext, Search } from './model/search';
import { TypeCluster } from './types';

import './App.scss';

const search = Search({
  facets: [
    { name: 'similarity', values: ['all', 'Identical', 'HasIdenticalProperties'], matches: (rec, v) => v === 'all' && ['Identical', 'HasIdenticalProperties'].includes(rec.group) || rec.group === v },
    { name: 'type', values: ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'], matches: (rec, v) => v === 'all' || rec.type === v },
  ],
});

function App() {
  const [allData, setAllData] = useState([] as TypeCluster[]);
  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Identical');
  const [selectedType, setSelectedType] = useState('literal');
  const [minProperties, setMinProperties] = useState(3);
  const [minFiles, setMinFiles] = useState(2);
  
  useEffect(() => {
    let i = 0;
    setAllData(
      window.__data__
        .reduce(
          (res, { name, clusters }) => [...res, ...(
            clusters.map(cluster => ({
              ...cluster,
              id: ++i,
              group: name,
              fulltext: fulltext(cluster as TypeCluster),
            }))
          )],
          [] as TypeCluster[],
        )
    );
  }, []);
  
  useEffect(() => {
    search.refresh(allData);
  }, [allData]);

  const filter = {
    selectedTab,
    selectedType,
    minFiles,
    minProperties,
  };

  const { results, facetsStats } = search.search(query, filter);

  // console.log(filter);
  // console.log({ results, facetsStats });

  const nav = [
    ['all', 'all', ''],
    ['Identical', 'Identical', 'Consider defining following types just once.'],
    ['HasIdenticalProperties', 'HasIdenticalProperties', ''],
    // ['HasSimilarProperties', 'Similar', ''],
  ];
  

  // useEffect(() => {
  //   if (groupsCounts[0] === 0 && groupsCounts[1] != 0) {
  //     setSelectedTab('HasIdenticalProperties');
  //   }
  // }, [groupsCounts, setSelectedTab]);

  const resultsMarkup = results.length === 0 ?
    <Empty /> :
    <ClusterListing clusters={results} />;

  return (
    <div id="app">
      <Navbar query={query} setQuery={setQuery} />
      <div className="main">
        <Filters
          nav={nav}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          minProperties={minProperties}
          setMinProperties={setMinProperties}
          minFiles={minFiles}
          setMinFiles={setMinFiles}
          facetsStats={facetsStats}
        />
        <div className="listing">
          {resultsMarkup}
        </div>
      </div>
    </div>
  );
}

export default App;
