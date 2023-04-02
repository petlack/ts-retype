import { FulltextData } from '../../types';
import { ClusterListing } from '../Cluster';
import { Empty } from '../Empty';
import './Listing.scss';

export type ListingProps = {
  results: FulltextData[];
}

export function Listing({ results }: ListingProps) {
  const resultsMarkup = results.length === 0 ?
    <Empty /> :
    <ClusterListing clusters={results} />;
  return (
    <div className="listing">
      <div className="info">
        <p>Displaying results</p>
      </div>
      {resultsMarkup}
    </div>
  );
}