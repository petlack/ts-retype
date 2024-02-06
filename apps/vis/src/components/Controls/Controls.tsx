import { FacetStats } from '../../model/facet.js';
import { Filter } from '../../model/filter.js';
import { InputNumber } from '@ts-retype/uikit';
import { Options } from '@ts-retype/uikit';
import { CANDIDATE_TYPES, SIMILARITIES } from '../../types.js';

export type FiltersProps = {
  filter: Filter,
  setFilter: (f: Filter) => void,
  stats: FacetStats;
}

export function Controls({
    filter,
    setFilter,
}: FiltersProps) {
    return (
        <div className="flex flex-col gap-4">
            <InputNumber
                value={filter.minFiles || 1}
                onChange={minFiles => setFilter(filter.setMinFiles(minFiles))}
                min={1}
            />
            <InputNumber
                value={filter.minProperties || 1}
                onChange={minProperties => setFilter(filter.setMinProperties(minProperties))}
                min={1}
            />
            <Options
                name='similarity'
                options={SIMILARITIES}
                onChange={similarity => setFilter(filter.setSimilarity(similarity))}>
            </Options>
            <Options
                name='type'
                options={CANDIDATE_TYPES}
                onChange={type => setFilter(filter.setType(type))}>
            </Options>
        </div>
    );
}
