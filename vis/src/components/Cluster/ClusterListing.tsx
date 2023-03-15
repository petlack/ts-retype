import { EnumTypeCluster, FulltextData, FunctionTypeCluster, LiteralTypeCluster, UnionTypeCluster } from '../../types';
import { EnumCluster } from './EnumCluster';
import { FunctionCluster } from './FunctionCluster';
import { LiteralCluster } from './LiteralCluster';
import { UnionCluster } from './UnionCluster';

import './ClusterListing.scss';

export function ClusterListing({ clusters, query }: { clusters: FulltextData[], query: string }) {
  const clustersMarkup = clusters.map((c, idx) => {
    const literalType = {
      ...c,
      name: c.names[0].name,
      type: c.files[0].type,
    };
    switch (literalType.type) {
    case 'alias':
    case 'interface':
    case 'literal':
      return <LiteralCluster key={idx} query={query} {...(literalType as LiteralTypeCluster)} />;
    case 'function':
      return <FunctionCluster key={idx} query={query} {...(literalType as FunctionTypeCluster)} />;
    case 'enum':
      return <EnumCluster key={idx} query={query} {...(literalType as EnumTypeCluster)} />;
    case 'union':
      return <UnionCluster key={idx} query={query} {...(literalType as UnionTypeCluster)} />;
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