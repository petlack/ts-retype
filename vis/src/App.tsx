import { useEffect, useState } from 'react';
import MiniSearch from 'minisearch';

import { ClusterListing } from './components/Cluster';
import { Empty } from './components/Empty';
import { Filters } from './components/Filters';
import { Navbar } from './components/Navbar';

import { TypeCluster } from './types';

import './App.scss';

const miniSearch = new MiniSearch({
  fields: ['name', 'fulltext'],
  storeFields: ['name', 'type', 'names', 'files', 'properties', 'parameters', 'returnType', 'group', 'fulltext'],
});

function fulltext(cluster: TypeCluster): string {
  return [
    `${cluster.name}`,
    `${Object.keys(cluster.names).join(' ')}`,
    `${cluster.files.map(({ file }) => file).join(' ')}`,
    `${(cluster.properties || []).map(({ key, value, type }) => `${type} ${key}: ${value}`).join(' ')}`,
    `${(cluster.parameters || []).map(({ key, value, type }) => `${type} ${key}: ${value}`).join(' ')}`,
    `${(cluster.members || []).join(' ')}`,
    `${(cluster.types || []).join(' ')}`,
  ].join(' ');
}

function App() {
  const [allData, setAllData] = useState([] as TypeCluster[]);
  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Identical');
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
    miniSearch.removeAll();
    miniSearch.addAll(allData);
  }, [allData]);

  const filteredData = query.trim().length ? miniSearch.search(query, { fuzzy: true, prefix: true }) as unknown as TypeCluster[] : allData;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = filteredData.filter(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ({ group, files, properties = [], parameters = [], members = [], types = [] }) =>
      group === selectedTab &&
      properties.length + parameters.length + members.length + types.length >= minProperties &&
      files.length >= minFiles
  );

  const nav = [
    ['Identical', '', 'Consider defining following types just once.'],
    ['HasIdenticalProperties', 'Renamed', ''],
    // ['HasSimilarProperties', 'Similar', ''],
  ];

  const groupsCounts = [
    filteredData.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ group, files, properties = [], parameters = [], members = [], types = [] }) =>
        group === nav[0][0] &&
        properties.length + parameters.length + members.length + types.length >= minProperties &&
        files.length >= minFiles
    ).length,
    filteredData.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ group, files, properties = [], parameters = [], members = [], types = [] }) =>
        group === nav[1][0] &&
        (properties.length + parameters.length + members.length + types.length >= minProperties) &&
        files.length >= minFiles
    ).length,
  ];

  useEffect(() => {
    if (groupsCounts[0] === 0 && groupsCounts[1] != 0) {
      setSelectedTab('HasIdenticalProperties');
    }
  }, [groupsCounts, setSelectedTab]);

  const dataMarkup = data.length === 0 ?
    <Empty /> :
    <ClusterListing name={selectedTab} clusters={data} />;

  return (
    <div id="app">
      <Navbar query={query} setQuery={setQuery} />
      <div className="main">
        <Filters
          nav={nav}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          minProperties={minProperties}
          setMinProperties={setMinProperties}
          minFiles={minFiles}
          setMinFiles={setMinFiles}
          groupsCounts={groupsCounts}
        />
        <div className="listing">
          {dataMarkup}
        </div>
      </div>
    </div>
  );
}

export default App;
