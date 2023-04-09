import { useCallback, useState } from 'react';
import { ArrayElement } from '../../../../src/types';
import { ClusterTitle } from './ClusterTitle';
import { DefinitionSnippet } from './DefinitionSnippet';
import { Explorer } from '../Explorer';
import { ExplorerProps } from '../Explorer/Explorer';

import './BaseCluster.scss';
import { Cluster } from '../../types';

export function BaseCluster({ files, names }: Cluster) {
  const [selectedFile, setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
  const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
    setSelectedFile(node.data);
  }, [setSelectedFile]);

  return (
    <div className="cluster">
      <ClusterTitle names={names} type={selectedFile.type} />
      <DefinitionSnippet {...selectedFile} />
      <Explorer files={files} onClick={onClick} />
    </div>
  );
}