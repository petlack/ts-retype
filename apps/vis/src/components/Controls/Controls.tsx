import { CANDIDATE_TYPES, SIMILARITIES } from '../../types.js';
import { InputNumber, Options } from '@ts-retype/uikit';
import { FacetStats } from '../../model/facet.js';
import { Filter } from '../../model/filter.js';
import { clsx } from '@ts-retype/uikit/clsx';

export type FiltersProps = {
  filter: Filter,
  setFilter: (f: Filter) => void,
  stats: FacetStats;
}

export function Controls({
    filter,
    setFilter,
}: FiltersProps) {
    const inputGroupStyle = 'flex flex-col gap-2';
    const labelStyle = 'text-neutral-400 text-sm font-bold uppercase';
    const inputStyle = 'bg-accent-100';
    const choicesStyle = 'flex flex-col gap-1';
    const baseOptionStyle = clsx(
        'px-2 py-1',
        'transition',
        'rounded-bl-md rounded-tr-md',
        'cursor-pointer',
        'capitalize text-md',
    );
    const optionStyle = clsx(
        baseOptionStyle,
        'text-neutral-500',
        'hover:bg-accent-100',
        'border-b border-l border-transparent',
    );
    const selectedOptionStyle = clsx(
        baseOptionStyle,
        'border-b border-l border-accent-500 bg-accent-100',
        'hover:bg-accent-50',
        'text-neutral-800',
    );

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-10">
                <div className={clsx(inputGroupStyle, 'items-center')}>
                    <label
                        htmlFor="input-min-files"
                        className={labelStyle}
                    >No. of duplicates</label>
                    <InputNumber
                        id="input-min-files"
                        className={inputStyle}
                        value={filter.minFiles || 1}
                        onChange={minFiles => setFilter(filter.setMinFiles(minFiles))}
                        min={1}
                    />
                </div>
                <div className={clsx(inputGroupStyle, 'items-center')}>
                    <label
                        htmlFor="input-min-props"
                        className={labelStyle}
                    >No. of properties</label>
                    <InputNumber
                        id="input-min-props"
                        className={inputStyle}
                        value={filter.minProperties || 1}
                        onChange={minProperties => setFilter(filter.setMinProperties(minProperties))}
                        min={1}
                    />
                </div>
                <div className={inputGroupStyle}>
                    <label htmlFor="similarity" className={labelStyle}>Similarity</label>
                    <Options
                        name='similarity'
                        options={SIMILARITIES}
                        className={choicesStyle}
                        optionClassName={optionStyle}
                        selectedOptionClassName={selectedOptionStyle}
                        onChange={similarity => setFilter(filter.setSimilarity(similarity))}>
                    </Options>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <div className={inputGroupStyle}>
                    <label htmlFor="type" className={labelStyle}>Type</label>
                    <Options
                        name='type'
                        options={CANDIDATE_TYPES}
                        className={choicesStyle}
                        optionClassName={optionStyle}
                        selectedOptionClassName={selectedOptionStyle}
                        onChange={type => setFilter(filter.setType(type))}>
                    </Options>
                </div>
            </div>
        </div>
    );
}
