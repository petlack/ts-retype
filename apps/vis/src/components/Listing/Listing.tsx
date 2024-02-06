import { CANDIDATE_TYPES, FulltextData, SIMILARITIES } from '../../types.js';
import type { Metadata } from '@ts-retype/search/types';
import { Listing as DuplicateListing } from '../Duplicate/index.js';
import { Empty } from '../Empty/index.js';
import type { Filter } from '../../model/filter.js';
import { FC, ReactNode } from 'react';
import { Tooltip } from '@ts-retype/uikit';

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

export const Listing: FC<ListingProps> = ({ meta, results, filter }) => {
    const resultsMarkup = results.length === 0 ?
        <Empty /> :
        <DuplicateListing duplicates={results} />;

    const similarities = filter.selectedSimilarity === 'all' ?
        SIMILARITIES.filter(s => s !== 'all') :
        [filter.selectedSimilarity];

    const types = filter.selectedType === 'all' ?
        CANDIDATE_TYPES.filter(s => s !== 'all') :
        [filter.selectedType];

    const msgMarkup = (
        <>
            <p>Found {span('strong')(duplicate(results.length))} matching criteria in {span('strong')(meta.projectName)}</p>
            <div className="flex flex-row flex-wrap gap-1">
                <span>Showing</span>
                <span>{list(types, 'or ')}</span>
                <span>types that are</span>
                <span>{list(similarities, 'or ')}</span>
                <span>appearing in at least</span>
                {span('strong')(file(filter.minFiles ?? 0))}
                <span>and having at least</span>
                {span('strong')(feature(filter.minProperties ?? 0))}
                {/* <FeaturesTooltip /> */}
            </div>
        </>
    );

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col self-center gap-1 max-w-3xl py-4 text-neutral-600">
                {msgMarkup}
            </div>
            {resultsMarkup}
        </div>
    );
};

export const FeaturesTooltip: FC = () =>
    <Tooltip>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
        <div className="tooltip-content">
            <span>Features are</span>
            <ul>
                <li>properties in Literal Types</li>
                <li>parameters in Function Types</li>
                <li>members in Enum Types</li>
            </ul>
        </div>
    </Tooltip>;
