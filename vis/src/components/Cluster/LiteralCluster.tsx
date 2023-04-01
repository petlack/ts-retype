import { ClusterTitle } from './ClusterTitle';
import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { LiteralTypeCluster } from '../../types';
import { NamesListing } from './NamesListing';

import './BaseCluster.scss';

export function LiteralCluster({ type, query, files, properties, names }: LiteralTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} query={query} />
      <NamesListing names={names} query={query} />
      <KeyValueFeatures keyValues={properties} query={query} name="Type properties" />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}