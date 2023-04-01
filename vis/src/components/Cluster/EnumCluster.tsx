import { ClusterTitle } from './ClusterTitle';
import { EnumTypeCluster } from '../../types';
import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { ValueFeatures } from './ValueFeatures';

import './BaseCluster.scss';

export function EnumCluster({ type, query, files, members, names }: EnumTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} query={query} />
      <NamesListing names={names} query={query} />
      <ValueFeatures title="Members" query={query} values={members} />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}