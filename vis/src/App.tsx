import { useEffect, useState } from 'react';
import MiniSearch from 'minisearch';
import './App.css'
import { Cluster } from './Cluster'
import { Data, TypeCluster } from './types'

function Category({ clusters }: Data) {
  const clustersMarkup = clusters.map((c, idx) => (
    <Cluster key={idx} {...c} />
  ))
  return (
    <>
      <div className="clusters">
        {clustersMarkup}
      </div>
    </>
  )
}

const miniSearch = new MiniSearch({
  fields: ['name', 'fulltext'],
  storeFields: ['name', 'names', 'files', 'properties', 'group', 'fulltext'],
})

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
    )
  }, []);
  
  useEffect(() => {
    miniSearch.removeAll();
    miniSearch.addAll(allData);
  }, [allData]);

  const filteredData = query.trim().length ? miniSearch.search(query, { fuzzy: true, prefix: true }) : allData;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const data = filteredData.filter(({ group, properties }) => group === selectedTab && properties.length > 1);
  const data = filteredData.filter(({ group }) => group === selectedTab);

  const nav = [
    ['Identical', null, 'Consider defining following types just once.'],
    ['HasIdenticalProperties', 'Renamed', ''],
    // ['HasSimilarProperties', 'Similar', ''],
  ]

  const navMarkup = nav.map(name => (
    <a
      key={name[0]}
      className={`nav ${name[0] === selectedTab ? 'selected' : ''}`}
      onClick={() => setSelectedTab(name[0] as string)}
    >{name[1] || name[0]} ({data[name[0]]?.length})</a>
  ));

  const dataMarkup = <Category name={selectedTab} clusters={data} />;

  return (
    <div id="app">
      <div className="navbar">
        <span className="left">
          <span className="logo">retype</span>
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
        {dataMarkup}
      </div>
    </div>
  )
}

export default App
