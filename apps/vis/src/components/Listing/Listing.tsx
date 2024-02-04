import { CANDIDATE_TYPES, FulltextData, SIMILARITIES } from '../../types.js';
import type { Metadata } from '@ts-retype/search/types';
import { Listing as DuplicateListing } from '../Duplicate/index.js';
import { Empty } from '../Empty/index.js';
import { FeaturesTooltip } from '../Filters/FeaturesTooltip.js';
import { Filter } from '../../model/search.js';
import { ReactNode } from 'react';

export type ListingProps = {
  results: FulltextData[];
  filter: Filter;
  meta: Metadata;
}

export type Entity = (word: string) => (count: number) => string;

const entity: Entity = (word: string) => (count: number) => {
    if (count === 1) {
        return `${count} ${word}`;
    }
    return `${count} ${word}s`;
};

function list(words: string[], join: string): ReactNode[] {
    if (words.length === 0) {
        return [''];
    }
    if (words.length === 1) {
        return [words[0]];
    }
    const head = words.slice(0, -1);
    const last = words.at(-1);
    const reduced = head.reduce((res, item, idx) => [
        ...res,
        <span className="strong" key={idx}>{item}</span>,
        <span key={`${idx},`}>{', '}</span>,
    ], [] as ReactNode[]);
    return [
        ...reduced,
        join,
        <span className="strong" key="last">{last || ''}</span>,
    ];
}

const span = (className = '') => (text: string) => {
    return (
        <span className={className}>{text}</span>
    );
};

const duplicate = entity('duplicate');
const file = entity('file');
const feature = entity('feature');

export function Listing({ meta, results, filter }: ListingProps) {
    const resultsMarkup = results.length === 0 ?
        <Empty /> :
        <DuplicateListing duplicates={results} />;

    const similarities = filter.selectedSimilarity === 'all' ? SIMILARITIES.filter(s => s !== 'all') : [filter.selectedSimilarity];
    const types = filter.selectedType === 'all' ? CANDIDATE_TYPES.filter(s => s !== 'all') : [filter.selectedType];

    const msgMarkup = (
        <>
            <p>Found {span('strong')(duplicate(results.length))} matching criteria in {span('strong')(meta.projectName)}</p>
            <div className="flex flex-row flex-wrap gap-1">
                <span>Showing</span>
                <span>{list(types, 'or ')}</span>
                <span>types that are</span>
                <span>{list(similarities, 'or ')}</span>
                <span>appearing in at least</span>
                {span('strong')(file(filter.minFiles))}
                <span>and having at least</span>
                {span('strong')(feature(filter.minProperties))}
                <FeaturesTooltip />
            </div>
        </>
    );

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-1 px-2 py-1 text-neutral-600">
                {msgMarkup}
            </div>
            {resultsMarkup}
        </div>
    );
}
