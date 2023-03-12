import { CandidateType, SourceFile } from '../../../../src/types';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { SearchableSpan } from '../SearchableSpan';
import { useToast } from '../Toast';

export type FileListingProps = {
  files: SourceFile[];
  type: CandidateType['type'];
  query: string;
}

export function FileListing({ files, type, query }: FileListingProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const showToast = useToast();

  const onFileClick = (file: string, lines: number[]) => {
    copyToClipboard(`${file}:${lines[0]}`);
    showToast('Copied to clipboard');
  };
  
  const filesMarkup = files.map(({ file, lines }) => (
    <span
      key={`${file}${lines}`}
      className="file"
      onClick={() => onFileClick(file, lines)}
    >
      <span>{'{'}{type[0].toUpperCase()}{'}'}</span>
      <SearchableSpan query={query} value={file} />
      <span>({lines[0]} - {lines[1]})</span>
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