import { useEffect, useState } from 'react';
import MiniSearch from 'minisearch';
import { LiteralCluster } from './components/Cluster/LiteralCluster';
import { FunctionCluster } from './components/Cluster/FunctionCluster';
import { EnumCluster } from './components/Cluster/EnumCluster';
import { UnionCluster } from './components/Cluster/UnionCluster';
import { IncDecInput } from './components/IncDecInput';
import { Empty } from './components/Empty';
import { Logo } from './components/Logo';
import { Data, EnumTypeCluster, FunctionTypeCluster, LiteralTypeCluster, TypeCluster, UnionTypeCluster } from './types';
import './App.scss';

function Clusters({ clusters }: Data) {
  const clustersMarkup = clusters.map((c, idx) => {
    switch (c.type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return <LiteralCluster {...(c as LiteralTypeCluster)} />;
    case 'function':
      return <FunctionCluster {...(c as FunctionTypeCluster)} />;
    case 'enum':
      return <EnumCluster {...(c as EnumTypeCluster)} />;
    case 'union':
      return <UnionCluster {...(c as UnionTypeCluster)} />;
    default:
      return (
        <div key={idx} className="cluster">
          <div className="title"><h2>Unknown cluster</h2></div>
          <div className="pre mono">{JSON.stringify(c, null, 2)}</div>
        </div>
      );

    }
  });

  return (
    <div className="clusters">
      {clustersMarkup}
    </div>
  );
}

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

  const navMarkup = nav.map((val, idx) => (
    <a
      key={val[0]}
      className={`nav ${val[0] === selectedTab ? 'selected' : ''}`}
      onClick={() => setSelectedTab(val[0])}
    >{val[1] || val[0]} ({groupsCounts[idx]})</a>
  ));

  const dataMarkup = data.length === 0 ?
    <Empty /> :
    <Clusters name={selectedTab} clusters={data} />;

  return (
    <div id="app">
      <div className="navbar">
        <span className="left">
          <Logo />
          <span className="search">
            <input
              type="text"
              value={query}
              placeholder="Search ..."
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </span>
        </span>
      </div>
      <div className="main">
        <div className="filters">
          <div className="filter">
            <span>Reason of similarity</span>
            <ul className="navmenu">
              {navMarkup}
            </ul>
          </div>
          <div className="filter">
            <span>Min number of properties</span>
            <IncDecInput value={minProperties} onChange={(value: number) => setMinProperties(value)} />
            <span>Min number of files</span>
            <IncDecInput value={minFiles} onChange={(value: number) => setMinFiles(value)} />
          </div>
        </div>
        <div className="listing">
          {dataMarkup}
        </div>
      </div>
    </div>
  );
}

export default App;
