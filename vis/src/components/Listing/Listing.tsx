import { FacetStats, Filter } from '../../model/search';
import { FulltextData } from '../../types';
import { ClusterListing } from '../Cluster';
import { Empty } from '../Empty';
import './Listing.scss';

export type ListingProps = {
  results: FulltextData[];
  filter: Filter;
  facetsStats: FacetStats;
}

function entity(word: string) {
  return function(count: number) {
    if (count === 1) {
      return `${count} ${word}`;
    }
    return `${count} ${word}s`;
  };
}

const duplicate = entity('duplicates');

export function Listing({ results, filter }: ListingProps) {
  const resultsMarkup = results.length === 0 ?
    <Empty /> :
    <ClusterListing clusters={results} />;

  const msgMarkup = (
    <>
      <p>Found {duplicate(results.length)} matching criteria</p>
      <p>{JSON.stringify(filter)}</p>
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