import { CANDIDATE_TYPES, FulltextData, SIMILARITIES } from '../../types';
import { ClusterListing } from '../Cluster';
import { Empty } from '../Empty';
import { FeaturesTooltip } from '../Filters/FeaturesTooltip';
import { Filter } from '../../model/search';
import { Metadata } from '../../../../src/types';
import { ReactNode } from 'react';
import './Listing.scss';

export type ListingProps = {
  results: FulltextData[];
  filter: Filter;
  meta: Metadata;
}

export type Entity = (word: string) => (count:number) => string;

const entity: Entity = (word: string) => (count: number)  => {
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
    <ClusterListing clusters={results} />;

  const similarities = filter.selectedSimilarity === 'all' ? SIMILARITIES.filter(s => s !== 'all') : [filter.selectedSimilarity];
  const types = filter.selectedType === 'all' ? CANDIDATE_TYPES.filter(s => s !== 'all') : [filter.selectedType];

  const msgMarkup = (
    <>
      <p>Found {span('strong')(duplicate(results.length))} matching criteria in {span('strong')(meta.projectName)}</p>
      <div className="info-description">
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
    <div className="listing">
      <div className="info">
        {msgMarkup}
      </div>
      {resultsMarkup}
    </div>
  );
}