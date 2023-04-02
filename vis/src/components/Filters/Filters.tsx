import { HTMLAttributes, useCallback } from 'react';
import { FacetStats, Filter, getFacetStat } from '../../model/search';
import { IncDecInput } from '../IncDecInput';
import { Tooltip } from '../Tooltip';
import { ControlsList } from './ControlsList';

import './Filters.scss';

export type FiltersProps = {
  filter: Filter,
  updateFilter: (f: Partial<Filter>) => void,
  facetsStats: FacetStats;
  visible: boolean;
}

// export const ControlsPanelGroup: FC<React.HTMLAttributes<HTMLElement> & { groupId: string }> = ({ children, groupId, ...props }) => {
//   return (
//     <ul
//       {...props}
//       id={groupId}
//       role="tabpanel"
//       // tabIndex={0}
//       aria-labelledby={groupId}
//       // aria-hidden="true"
//       aria-label={props['aria-label']}
//     >
//       {children}
//     </ul>
//   );
// };

// export const ControlsPanel: FC<React.HTMLAttributes<HTMLElement> & { groupId: string }> = ({ children, groupId, ...props }) => {
//   return (
//     <div
//       {...props}
//       role="tab"
//       aria-controls={groupId}
//       aria-label={props['aria-label']}
//     >
//       {children}
//     </div>
//   );
// };

export function Filters({
  filter,
  updateFilter,
  facetsStats,
  visible,
}: FiltersProps) {
  const updateMinProperties = (value: number) => updateFilter({ ...filter, minProperties: value });
  const updateMinFiles = (value: number) => updateFilter({ ...filter, minFiles: value });

  const similarities = ['all', 'identical', 'renamed'];
  const types = ['all', 'alias', 'enum', 'function', 'interface', 'literal', 'union'];

  const FilterSimButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
    const isSelected = id === selected;
    return (
      <a className={`nav button button--default nav ${isSelected ? 'selected' : ''}`} {...props}>
        {`${id} (${getFacetStat(facetsStats, id, filter.selectedType)})`}
      </a>
    );
  }, [facetsStats]);

  const FilterTypeButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
    const isSelected = id === selected;
    return (
      <a className={`nav button button--default nav ${isSelected ? 'selected' : ''}`} {...props}>
        {`${id} (${getFacetStat(facetsStats, filter.selectedTab, id)})`}
      </a>
    );
  }, [facetsStats]);
  
  return (
    <div className={`filters filters-${visible ? 'visible' : 'hidden'}`}>
      <div className="filter">
        <span className="label">Show types that are</span>
        <ControlsList
          className="navmenu"
          aria-label="Show types that are"
          Render={FilterSimButton}
          onSelect={(key) => updateFilter({ selectedTab: key })}
          selected={filter.selectedTab}
        >
          {similarities}
        </ControlsList>
      </div>

      <div className="filter">
        <span className="label">Filter by type</span>
        <ControlsList
          className="navmenu"
          aria-label="Filter by type"
          Render={FilterTypeButton}
          onSelect={(key) => updateFilter({ selectedType: key })}
          selected={filter.selectedType}
        >
          {types}
        </ControlsList>
      </div>

      <div className="filter">
        <span className="label">
          <span>Min number of features</span>
          <Tooltip>
            <span>Features are</span>
            <ul>
              <li>properties in Literal Types</li>
              <li>parameters in Function Types</li>
              <li>members in Enum Types</li>
            </ul>
          </Tooltip>
        </span>
        
        <IncDecInput
          value={filter.minProperties}
          onChange={updateMinProperties}
        />
        <span className="label">Min number of files</span>
        <IncDecInput
          value={filter.minFiles}
          onChange={updateMinFiles}
        />
      </div>
    </div>
  );
}