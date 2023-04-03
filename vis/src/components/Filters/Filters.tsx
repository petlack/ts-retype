import { HTMLAttributes, useCallback } from 'react';
import { Tooltip } from '../../hooks/useTooltip';
import { FacetStats, Filter, getFacetStat } from '../../model/search';
import { IncDecInput } from '../IncDecInput';
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
      <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
        {`${id} (${getFacetStat(facetsStats, id, filter.selectedType)})`}
      </a>
    );
  }, [facetsStats]);

  const FilterTypeButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
    const isSelected = id === selected;
    return (
      <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
        {`${id} (${getFacetStat(facetsStats, filter.selectedSimilarity, id)})`}
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
          onSelect={(key) => updateFilter({ selectedSimilarity: key })}
          selected={filter.selectedSimilarity}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            <div className="tooltip-content">
              <span>Features are</span>
              <ul>
                <li>properties in Literal Types</li>
                <li>parameters in Function Types</li>
                <li>members in Enum Types</li>
              </ul>
            </div> 
          </Tooltip>
          {/* <Tooltip>
            <span>Features are</span>
            <ul>
              <li>properties in Literal Types</li>
              <li>parameters in Function Types</li>
              <li>members in Enum Types</li>
            </ul>
          </Tooltip> */}
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