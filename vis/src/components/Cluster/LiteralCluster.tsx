import { ClusterTitle } from './ClusterTitle';
import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { LiteralTypeCluster } from '../../types';
import { NamesListing } from './NamesListing';

import './BaseCluster.scss';

export function LiteralCluster({ type, files, properties, names, group }: LiteralTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <KeyValueFeatures keyValues={properties} name="Type properties" />
      <FileListing files={files} type={type} similarity={group} />
    </div>
  );
}