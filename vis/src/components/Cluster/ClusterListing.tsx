import { BaseCluster } from './BaseCluster';
import { FulltextData } from '../../types';

import './ClusterListing.scss';

export function ClusterListing({ clusters }: { clusters: FulltextData[] }) {
  const clustersMarkup = clusters.map((cluster) => {
    return <BaseCluster key={cluster.id} {...cluster} />;
  });

  return (
    <div className="clusters">
      {clustersMarkup}
    </div>
  );
}