import { CandidateType, TypeDuplicate } from '../../../../src/types';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { SearchableSpan } from '../SearchableSpan';
import { useToast } from '../Toast';

import './FileListing.scss';
import { TypeIcon } from './TypeIcon';

export type FileListingProps = {
  files: TypeDuplicate['files'];
  type: CandidateType['type'];
  query: string;
}

export function FileListing({ files, query }: FileListingProps) {
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
      <SearchableSpan className="path" query={query} value={file} />
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