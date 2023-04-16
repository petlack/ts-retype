import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { SearchAwareText } from '../SearchAwareText';
import { useToast } from '../Toast';

import './FileListing.scss';

export type FileListingProps = {
  files: TypeDuplicate['files'];
  type: ArrayElement<TypeDuplicate['files']>['type'];
  similarity: TypeDuplicate['group'];
}

export function FileListing({ files, similarity }: FileListingProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const showToast = useToast();

  const onFileClick = (file: string, lines: number[]) => {
    copyToClipboard(`${file}:${lines[0]}`);
    showToast('Copied to clipboard');
  };
  
  const filesMarkup = files.map(({ file, lines, type }) => (
    <span
      key={`${file}${lines}`}
      className="file"
      onClick={() => onFileClick(file, lines)}
    >
      <span className="span"><SearchAwareText>{file}</SearchAwareText></span>
      <span className="lines">({lines[0]} - {lines[1]})</span>
    </span>
  ));

  const label = similarity === 'identical' ?
    `Found ${files.length} ${similarity} types` :
    `Found ${files.length} identical types with different names`;

  return (
    <div className="files">
      <h3>{label}</h3>
      {filesMarkup}
    </div>
  );
}