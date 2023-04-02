import { ClusterTitle } from './ClusterTitle';
import { EnumTypeCluster } from '../../types';
import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { ValueFeatures } from './ValueFeatures';

import './BaseCluster.scss';

export function EnumCluster({ type, files, members, names }: EnumTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <ValueFeatures title="Members" values={members} />
      <FileListing files={files} type={type} />
    </div>
  );
}