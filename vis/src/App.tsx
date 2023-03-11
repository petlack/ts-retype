import { useEffect, useState } from 'react';
import MiniSearch from 'minisearch';
import { Cluster } from './components/Cluster';
import { IncDecInput } from './components/IncDecInput';
import { Empty } from './components/Empty';
import { Logo } from './components/Logo';
import { Data, TypeCluster } from './types';
import './App.scss';

function Category({ clusters }: Data) {
  const clustersMarkup = clusters.map((c, idx) => (
    <Cluster key={idx} {...c} />
  ));

  return (
    <>
      <div className="clusters">
        {clustersMarkup}
      </div>
    </>
  );
}

const miniSearch = new MiniSearch({
  fields: ['name', 'fulltext'],
  storeFields: ['name', 'names', 'files', 'properties', 'group', 'fulltext'],
});

function fulltext(cluster: TypeCluster): string {
  return [
    `${cluster.name}`,
    `${Object.keys(cluster.names).join(' ')}`,
    `${cluster.files.map(({ file }) => file).join(' ')}`,
    `${cluster.properties.map(({ key, value, type }) => `${type} ${key}: ${value}`).join(' ')}`,
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
              fulltext: fulltext(cluster),
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
    ({ group, files, properties }) =>
      group === selectedTab &&
      properties.length >= minProperties &&
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
      ({ group, files, properties }) =>
        group === nav[0][0] &&
        properties.length >= minProperties &&
        files.length >= minFiles
    ).length,
    filteredData.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ group, files, properties }) =>
        group === nav[1][0] &&
        properties.length >= minProperties &&
        files.length >= minFiles
    ).length,
  ];

  useEffect(() => {
    if (groupsCounts[0] === 0 && groupsCounts[1] != 0) {
      setSelectedTab('HasIdenticalProperties');
    }
  }, [groupsCounts, setSelectedTab]);

  const NavItem = ({ displayName, num, isSelected, setSelected }: { displayName: string, num: number, isSelected: boolean, setSelected: () => void }) => (
    <a
      className={`nav ${isSelected ? 'selected' : ''}`}
      onClick={setSelected}
    >{displayName} ({num})</a>
  );

  const navMarkup = nav.map((val, idx) => (
    <NavItem
      key={val[0]}
      displayName={val[1] || val[0]}
      num={groupsCounts[idx]}
      isSelected={val[0] === selectedTab}
      setSelected={() => setSelectedTab(val[0])}
    />
  ));

  const dataMarkup = data.length === 0 ?
    <Empty /> :
    <Category name={selectedTab} clusters={data} />;

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
        <div className="right navmenu">
          {navMarkup}
        </div>
      </div>
      <div className="main">
        <div className="filters">
          <div className="filter">
            <span>Min number of Type properties</span>
            <IncDecInput value={minProperties} onChange={(value: number) => setMinProperties(value)} />
          </div>
          <div className="filter">
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
