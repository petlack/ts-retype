import { FacetStats, Filter, getFacetStat } from '../../model/search';
import { IncDecInput } from '../IncDecInput';

import './Filters.scss';

export type FiltersProps = {
  filter: Filter,
  updateFilter: (f: Partial<Filter>) => void,
  facetsStats: FacetStats;
}

export function Filters({
  filter,
  updateFilter,
  facetsStats,
}: FiltersProps) {
  const updateMinProperties = (value: number) => updateFilter({ ...filter, minProperties: value });
  const updateMinFiles = (value: number) => updateFilter({ ...filter, minFiles: value });

  const similarities = ['all', 'Identical', 'HasIdenticalProperties'];
  const similaritiesMarkup = similarities.map(sim => {
    const onClick = () => updateFilter({ selectedTab: sim });
    return (
      <a
        key={sim}
        className={`nav ${sim === filter.selectedTab ? 'selected' : ''}`}
        onClick={onClick}
      >{sim} ({getFacetStat(facetsStats, sim, filter.selectedType)})</a>
    );
  });

  const types = ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'];
  const typesMarkup = types.map(type => {
    const onClick = () => updateFilter({ ...filter, selectedType: type });
    return (
      <a
        key={type}
        className={`nav ${type === filter.selectedType ? 'selected' : ''}`}
        onClick={onClick}
      >{type} ({getFacetStat(facetsStats, filter.selectedTab, type)})</a>
    );
  });
  
  return (
    <div className="filters">
      <div className="filter">
        <span>Show types that are</span>
        <ul className="navmenu">
          {similaritiesMarkup}
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
        <IncDecInput
          value={filter.minProperties}
          onChange={updateMinProperties}
        />
        <span>Min number of files</span>
        <IncDecInput
          value={filter.minFiles}
          onChange={updateMinFiles}
        />
      </div>
    </div>
  );
}