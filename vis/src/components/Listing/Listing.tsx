import { FulltextData } from '../../types';
import { ClusterListing } from '../Cluster';
import { Empty } from '../Empty';
import './Listing.scss';

export type ListingProps = {
  results: FulltextData[];
  query: string;
}

export function Listing({ results, query }: ListingProps) {
  const resultsMarkup = results.length === 0 ?
    <Empty /> :
    <ClusterListing clusters={results} query={query} />;
  return (
    <div className="listing">
      <div className="info">
        <p>Displaying results</p>
      </div>
      {resultsMarkup}
    </div>
  );
}