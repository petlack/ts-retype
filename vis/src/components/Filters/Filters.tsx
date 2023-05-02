import { HTMLAttributes, useCallback } from 'react';
import { TypeDuplicate } from '@ts-retype/retype/src/types';
import { FacetStats, Filter, getFacetStat } from '../../model/search';
import { SIMILARITIES, CANDIDATE_TYPES } from '../../types';
import { Badge } from '../Duplicate/Badge';
import { IconLetter } from '../Explorer/icons';
import { IncDecInput } from '../IncDecInput';
import { ControlsList } from './ControlsList';
import { FeaturesTooltip } from './FeaturesTooltip';
import { Button, IconMoon, IconSun,useTheme } from '@ts-retype/uikit';
import { themes } from '../../themes';
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

  const { setTheme } = useTheme();

  const setLightTheme = useCallback(() => setTheme(themes.light), [setTheme]);
  const setDarkTheme = useCallback(() => setTheme(themes.dark), [setTheme]);

  const FilterSimButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
    const isSelected = id === selected;
    return (
      <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
        <span>{id !== 'all' ? <Badge names={{} as TypeDuplicate['names']} group={id as TypeDuplicate['group']} /> : 'all '}</span>
        <span>{` (${getFacetStat(facetsStats, id, filter.selectedType)})`}</span>
      </a>
    );
  }, [facetsStats]);

  const FilterTypeButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
    const isSelected = id === selected;
    return (
      <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
        {id !== 'all' && <IconLetter letter={id[0].toUpperCase()} />} {`${id !== 'all' ? id.slice(1) : id} (${getFacetStat(facetsStats, filter.selectedSimilarity, id)})`}
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
          {SIMILARITIES}
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
          {CANDIDATE_TYPES}
        </ControlsList>
      </div>

      <div className="filter">
        <span className="label">
          <span>Min number of features</span>
          <FeaturesTooltip />
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

      <Button icon={IconSun} caption="light" style="default" size="md" kind="button" onClick={setLightTheme} />
      <Button icon={IconMoon} caption="dark" style="default" size="md" kind="button" onClick={setDarkTheme} />
    </div>
  );
}