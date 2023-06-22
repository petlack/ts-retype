import { forwardRef, PropsWithChildren } from 'react';
// import { TypeDuplicate } from '@ts-retype/retype/src/types';
import { FacetStats, Filter, getFacetStat } from '../../model/search.js';
import { SIMILARITIES, CANDIDATE_TYPES } from '../../types.js';
// import { Badge } from '../Duplicate/Badge.js';
// import { IconLetter } from '../Explorer/icons.js';
import { IncDecInput } from '../IncDecInput/index.js';
// import { Card } from 'theme-ui';
import { Box, Heading, Options, OptionItem, Stack, BoxProps, Input, Button } from '@ts-retype/uikit';
import { FeaturesTooltip } from './FeaturesTooltip.js';
import { FaMinus, FaPlus } from 'react-icons/fa';
// import { Button, IconMoon, IconSun, useTermix } from '@ts-retype/uikit';
// import { themes } from '../../themes.js';
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

  // const { setTheme } = useTheme();
  //
  // const setLightTheme = useCallback(() => setTheme(themes.light), [setTheme]);
  // const setDarkTheme = useCallback(() => setTheme(themes.dark), [setTheme]);
  //
  // const FilterSimButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
  //   const isSelected = id === selected;
  //   return (
  //     <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
  //       <span>{id !== 'all' ? <Badge sx={{ cursor: 'pointer' }} names={{} as TypeDuplicate['names']} group={id as TypeDuplicate['group']} /> : 'all '}</span>
  //       <span>{` (${getFacetStat(facetsStats, id, filter.selectedType)})`}</span>
  //     </a>
  //   );
  // }, [facetsStats]);
  //
  // const FilterTypeButton = useCallback(({ id, selected, ...props }: { id: string, selected: string } & HTMLAttributes<HTMLElement>) => {
  //   const isSelected = id === selected;
  //   return (
  //     <a className={`button button--default nav ${isSelected ? 'nav--selected' : ''}`} {...props}>
  //       {id !== 'all' && <IconLetter letter={id[0].toUpperCase()} />} {`${id !== 'all' ? id.slice(1) : id} (${getFacetStat(facetsStats, filter.selectedSimilarity, id)})`}
  //     </a>
  //   );
  // }, [facetsStats]);
  //

  const FiltersHeading = ({ children }: { children: string }) => (
    <Heading as='h4' color='primary-200'>{children}</Heading>
  );

  const FiltersGroup = ({ children }: PropsWithChildren) => (
    <Stack align='stretch' sx={{ gap: 2 }}>
      {children}
    </Stack>
  );

  const FilterOption = forwardRef(({ children, ...props }: BoxProps & { children: string }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        bg: 'transparent',
        color: 'primary-100',
        position: 'relative',
        px: 2,
        py: 1,
        cursor: 'default',
        borderRadius: 'sm',
        userSelect: 'none',
        transition: '150ms ease-in',
        transitionProperty: 'background,color',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 'var(--space-2)',
          left: '0',
          bottom: 'var(--space-2)',
          width: 'var(--size-1)',
          bg: 'transparent',
          transition: '150ms ease-in',
          transitionProperty: 'background,color',
        },
        '&:hover': {
          bg: 'primary-600',
        },
        '&[aria-checked=\'true\']': {
          bg: 'primary-800',
          color: 'base',
        },
      }}
    >
      {children}
    </Box>
  ));

  return (
    <Stack sx={{ gap: 4 }}>
      <FiltersGroup>
        <FiltersHeading>Show types that are</FiltersHeading>
        <Options name='foo' tx={{ corners: 'round' }} sx={{ gap: 2, overflow: 'hidden' }} onChange={(e) => console.log(e)}>
          {SIMILARITIES.map(sim => (
            <OptionItem key={sim} value={sim}><FilterOption>{sim}</FilterOption></OptionItem>
          ))}
        </Options>
      </FiltersGroup>


      {/* <span className="label">Show types that are</span> */}
      {/* <ControlsList */}
      {/*   className="navmenu" */}
      {/*   aria-label="Show types that are" */}
      {/*   Render={FilterSimButton} */}
      {/*   onSelect={(key) => updateFilter({ selectedSimilarity: key })} */}
      {/*   selected={filter.selectedSimilarity} */}
      {/* > */}
      {/*   {SIMILARITIES} */}
      {/* </ControlsList> */}

      <FiltersGroup>
        <FiltersHeading>Filter by type</FiltersHeading>
        <Options name='foo' tx={{ corners: 'round' }} sx={{ gap: 2, overflow: 'hidden' }}>
          {CANDIDATE_TYPES.map(type => (
            <OptionItem key={type} value={type}><FilterOption>{type}</FilterOption></OptionItem>
          ))}
        </Options>
      </FiltersGroup>
      {/* <span className="label">Filter by type</span> */}
      {/* <ControlsList */}
      {/*   className="navmenu" */}
      {/*   aria-label="Filter by type" */}
      {/*   Render={FilterTypeButton} */}
      {/*   onSelect={(key) => updateFilter({ selectedType: key })} */}
      {/*   selected={filter.selectedType} */}
      {/* > */}
      {/*   {CANDIDATE_TYPES} */}
      {/* </ControlsList> */}


      <FiltersGroup>
        <FiltersHeading>Min number of features</FiltersHeading>
        {/* <Input type="number" tx={{ colorScheme: 'primary', fill: 'solid' }} /> */}
        <Input
          type='number'
          id='inputs-number'
          size={3}
          width='auto'
          tx={{ colorScheme: 'primary', fill: 'solid' }}
          leftOuter={<Button tx={{ fill: 'ghost' }} sx={{ p: 0, aspectRatio: 1, width: '2em', justifyContent: 'center' }}><FaMinus /></Button>}
          rightOuter={<Button tx={{ fill: 'ghost' }} sx={{ p: 0, aspectRatio: 1, width: '2em', justifyContent: 'center' }}><FaPlus /></Button>}
        />
      </FiltersGroup>

      <FiltersGroup>
        <FiltersHeading>Min number of files</FiltersHeading>
        <Input type="number" tx={{ colorScheme: 'primary', fill: 'solid' }} />
      </FiltersGroup>

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
      </div>

      <div className="filter">
        <span className="label">Min number of files</span>
        <IncDecInput
          value={filter.minFiles}
          onChange={updateMinFiles}
        />
      </div>

    </Stack>
  );
}
