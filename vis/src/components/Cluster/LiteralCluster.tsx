import { LiteralTypeCluster } from '../../types';

import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { NamesListing } from './NamesListing';
import { TypeIcon } from './TypeIcon';

import './BaseCluster.scss';

export function LiteralCluster({ type, query, files, properties, names }: LiteralTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <div className="title">
        <TypeIcon type={type} />
        <NamesListing names={names} query={query} />
      </div>
      <KeyValueFeatures keyValues={properties} query={query} name="Type properties" />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}