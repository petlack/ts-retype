import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import { toTokenElements } from '../../../../docs/src/components/Token';
import { Code } from '../../../../docs/src/components/Code';
import { Snippet } from '../../../../src/types/snippet';

export function DefinitionSnippet({ srcHgl, name }: ArrayElement<TypeDuplicate['files']>) {
  return (
    <div className="snippet">
      <Code>{toTokenElements({ name, lang: 'ts', code: srcHgl } as Snippet)}</Code>
    </div>
  );
}