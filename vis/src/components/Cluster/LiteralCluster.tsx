import { useCallback, useState } from 'react';
import { ArrayElement } from '../../../../src/types';
import { ClusterTitle } from './ClusterTitle';
import { DefinitionSnippet } from './DefinitionSnippet';
import { Explorer } from '../Explorer';
import { ExplorerProps } from '../Explorer/Explorer';
import { LiteralTypeCluster } from '../../types';

import './BaseCluster.scss';

export function LiteralCluster({ type, files, names }: LiteralTypeCluster) {
  const [selectedFile, setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
  const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
    if (node.data.file) {
      setSelectedFile(node.data.file);
    }
  }, [setSelectedFile]);

  return (
    <div className="cluster">
      <ClusterTitle names={names} type={type} />
      <DefinitionSnippet {...selectedFile} />
      <Explorer files={files} onClick={onClick} />
    </div>
  );
}