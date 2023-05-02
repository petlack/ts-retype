import { useCallback, useState } from 'react';
import type { ArrayElement, TypeDuplicate } from '@ts-retype/retype';
import { Title } from './Title';
import { DefinitionSnippet } from './DefinitionSnippet';
import { Explorer, ExplorerProps } from '../Explorer';
import './Duplicate.scss';

export function Duplicate({ files, names, group }: TypeDuplicate) {
  const [selectedFile, setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
  const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
    if (node.data.file) {
      setSelectedFile(node.data.file);
    }
  }, [setSelectedFile]);

  return (
    <div className="duplicate">
      <Title names={names} selectedFile={selectedFile} type={selectedFile.type} group={group} />
      <DefinitionSnippet {...selectedFile} />
      <Explorer files={files} selectedFile={selectedFile} onClick={onClick} />
    </div>
  );
}