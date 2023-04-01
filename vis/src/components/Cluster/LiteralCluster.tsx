import { LiteralTypeCluster } from '../../types';

import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { DuplicateName, NamesListing } from './NamesListing';
import { TypeIcon } from './TypeIcon';

import './BaseCluster.scss';

export function LiteralCluster({ type, query, files, properties, names }: LiteralTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <div className="title">
        <TypeIcon type={type} />
        <DuplicateName names={names} query={query} />
      </div>
      <NamesListing names={names} query={query} />
      <KeyValueFeatures keyValues={properties} query={query} name="Type properties" />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}