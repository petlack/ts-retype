import { UnionTypeCluster } from '../../types';

import { FileListing } from './FileListing';
import { NamesListing } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { ValueFeatures } from './ValueFeatures';

import './BaseCluster.scss';

export function UnionCluster({ type, query, files, types, names }: UnionTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <div className="title">
        <TypeIcon type={type} />
        <NamesListing names={names} query={query} />
      </div>
      <ValueFeatures title="Strings" query={query} values={types} />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}