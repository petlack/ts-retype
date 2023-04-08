import { ClusterTitle } from './ClusterTitle';
import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { ValueFeatures } from './ValueFeatures';
import { UnionTypeCluster } from '../../types';

import './BaseCluster.scss';

export function UnionCluster({ type, files, group, types, names }: UnionTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <ValueFeatures title="Strings" values={types} />
      <FileListing files={files} similarity={group} type={type} />
    </div>
  );
}