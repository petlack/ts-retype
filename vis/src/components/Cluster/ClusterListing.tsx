import { EnumTypeCluster, FulltextData, FunctionTypeCluster, LiteralTypeCluster, UnionTypeCluster } from '../../types';
import { EnumCluster } from './EnumCluster';
import { FunctionCluster } from './FunctionCluster';
import { LiteralCluster } from './LiteralCluster';
import { UnionCluster } from './UnionCluster';

import './ClusterListing.scss';

export function ClusterListing({ clusters }: { clusters: FulltextData[] }) {
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
      return <LiteralCluster key={idx} {...(literalType as LiteralTypeCluster)} />;
    case 'function':
      return <FunctionCluster key={idx} {...(literalType as FunctionTypeCluster)} />;
    case 'enum':
      return <EnumCluster key={idx} {...(literalType as EnumTypeCluster)} />;
    case 'union':
      return <UnionCluster key={idx} {...(literalType as UnionTypeCluster)} />;
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