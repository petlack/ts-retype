import { Data, EnumTypeCluster, FunctionTypeCluster, LiteralTypeCluster, UnionTypeCluster } from '../../types';
import { EnumCluster } from './EnumCluster';
import { FunctionCluster } from './FunctionCluster';
import { LiteralCluster } from './LiteralCluster';
import { UnionCluster } from './UnionCluster';

import './ClusterListing.scss';

export function ClusterListing({ clusters, query }: Pick<Data, 'clusters'> & { query: string }) {
  const clustersMarkup = clusters.map((c, idx) => {
    switch (c.type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return <LiteralCluster key={idx} query={query} {...(c as LiteralTypeCluster)} />;
    case 'function':
      return <FunctionCluster key={idx} query={query} {...(c as FunctionTypeCluster)} />;
    case 'enum':
      return <EnumCluster key={idx} query={query} {...(c as EnumTypeCluster)} />;
    case 'union':
      return <UnionCluster key={idx} query={query} {...(c as UnionTypeCluster)} />;
    default:
      return (
        <div key={idx} className="cluster">
          <div className="title"><h2>Unknown cluster</h2></div>
          <div className="pre mono">{JSON.stringify(c, null, 2)}</div>
        </div>
      );

    }
  });

  return (
    <div className="clusters">
      {clustersMarkup}
    </div>
  );
}