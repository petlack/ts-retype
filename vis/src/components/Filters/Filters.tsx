import { FacetStats, getFacetStat } from '../../model/search';
import { IncDecInput } from '../IncDecInput';

import './Filters.scss';

export type FiltersProps = {
  nav: string[][];
  selectedTab: string;
  setSelectedTab: (x: string) => void;
  selectedType: string;
  setSelectedType: (x: string) => void;
  minProperties: number;
  setMinProperties: (x: number) => void;
  minFiles: number;
  setMinFiles: (x: number) => void;
  facetsStats: FacetStats;
}

export function Filters({
  nav,
  selectedTab,
  setSelectedTab,
  selectedType,
  setSelectedType,
  minProperties,
  setMinProperties,
  minFiles,
  setMinFiles,
  facetsStats,
}: FiltersProps) {
  const navMarkup = nav.map(val => (
    <a
      key={val[0]}
      className={`nav ${val[0] === selectedTab ? 'selected' : ''}`}
      onClick={() => setSelectedTab(val[0])}
    >{val[1] || val[0]} ({getFacetStat(facetsStats, val[0], selectedType)})</a>
  ));

  const types = ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'];
  const typesMarkup = types.map(type => (
    <a
      key={type}
      className={`nav ${type === selectedType ? 'selected' : ''}`}
      onClick={() => setSelectedType(type)}
    >{type} ({getFacetStat(facetsStats, selectedTab, type)})</a>
  ));
  
  return (
    <div className="filters">
      <div className="filter">
        <span>Show types that are</span>
        <ul className="navmenu">
          {navMarkup}
        </ul>
      </div>
      <div className="filter">
        <span>Filter by type</span>
        <ul className="navmenu">
          {typesMarkup}
        </ul>
      </div>
      <div className="filter">
        <span>Min number of properties</span>
        <IncDecInput value={minProperties} onChange={(value: number) => setMinProperties(value)} />
        <span>Min number of files</span>
        <IncDecInput value={minFiles} onChange={(value: number) => setMinFiles(value)} />
      </div>
    </div>
  );
}