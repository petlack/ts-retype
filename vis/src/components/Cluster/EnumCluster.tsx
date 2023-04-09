import { ClusterTitle } from './ClusterTitle';
import { DefinitionSnippet } from './DefinitionSnippet';
import { EnumTypeCluster } from '../../types';
import { FileListing } from './FileListing';

import './BaseCluster.scss';

export function EnumCluster({ type, group, files, names }: EnumTypeCluster) {
  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <DefinitionSnippet {...files[0]} />
      <FileListing files={files} similarity={group} type={type} />
    </div>
  );
}