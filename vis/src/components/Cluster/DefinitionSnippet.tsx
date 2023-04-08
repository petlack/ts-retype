import { TypeDuplicate } from '../../../../src/types';
import { Snippet, toTokenElements } from '../../../../docs/src/components/Token';
import { Code } from '../../../../docs/src/components/Code';

export function DefinitionSnippet({ files }: Pick<TypeDuplicate, 'files'>) {
  return (
    <div className="snippet">
      <Code>{toTokenElements({ name: '', lang: 'ts', code: files[0].srcHgl } as Snippet)}</Code>
      {/* <pre>{files[0].src}</pre> */}
    </div>
  );
}