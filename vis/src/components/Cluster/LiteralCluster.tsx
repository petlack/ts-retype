import { ClusterTitle } from './ClusterTitle';
import { FileListing } from './FileListing';
import { DefinitionSnippet } from './DefinitionSnippet';
import { LiteralTypeCluster } from '../../types';
import { NamesListing } from './NamesListing';

import './BaseCluster.scss';

export function LiteralCluster({ type, files, names, group }: LiteralTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <DefinitionSnippet files={files} />
      <FileListing files={files} type={type} similarity={group} />
    </div>
  );
}