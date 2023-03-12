import { EnumTypeCluster } from '../../types';

import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { ValueFeatures } from './ValueFeatures';

import './BaseCluster.scss';

export function EnumCluster({ type, query, files, members, names }: EnumTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <div className="title">
        <TypeIcon type={type} />
        <NamesListing names={names} query={query} />
      </div>
      <ValueFeatures title="Members" query={query} values={members} />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}