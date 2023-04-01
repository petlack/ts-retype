import { ClusterTitle } from './ClusterTitle';
import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { ValueFeatures } from './ValueFeatures';
import { UnionTypeCluster } from '../../types';

import './BaseCluster.scss';

export function UnionCluster({ type, query, files, types, names }: UnionTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} query={query} />
      <NamesListing names={names} query={query} />
      <ValueFeatures title="Strings" query={query} values={types} />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}