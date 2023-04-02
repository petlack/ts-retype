import { CandidateType, TypeDuplicate } from '../../../../src/types';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { SearchAwareText } from '../SearchAwareText';
import { useToast } from '../Toast';

import './FileListing.scss';
import { TypeIcon } from './TypeIcon';

export type FileListingProps = {
  files: TypeDuplicate['files'];
  type: CandidateType['type'];
}

export function FileListing({ files }: FileListingProps) {
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
      {/* <span className="type">{'{'}{type[0].toUpperCase()}{'}'}</span> */}
      <TypeIcon type={type} />
      <span className="span"><SearchAwareText>{file}</SearchAwareText></span>
      <span className="lines">({lines[0]} - {lines[1]})</span>
    </span>
  ));

  return (
    <div className="files">
      <h3>Found in {files.length} files</h3>
      <pre>
        {filesMarkup}
      </pre>
    </div>
  );
}