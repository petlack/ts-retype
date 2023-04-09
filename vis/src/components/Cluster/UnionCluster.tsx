import { ClusterTitle } from './ClusterTitle';
import { DefinitionSnippet } from './DefinitionSnippet';
import { FileListing } from './FileListing';
import { UnionTypeCluster } from '../../types';

import './BaseCluster.scss';

export function UnionCluster({ type, files, group, names }: UnionTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <DefinitionSnippet {...files[0]} />
      <FileListing files={files} similarity={group} type={type} />
    </div>
  );
}