import { splitLines } from '@ts-retype/retype/dist/snippet';
import { Lines, TokenElement } from '@ts-retype/uikit';
import { useSearchPhrase } from '../../hooks/useSearchPhrase';
import { highlightDefinition, highlightPhrase } from '../../model/snippet';
import type { ArrayElement, Snippet, TokenRoot, TypeDuplicate } from '@ts-retype/retype';

import './DefinitionSnippet.scss';

const EMPTY_ROOT: TokenRoot = { type: 'root', children: [] };

export function DefinitionSnippet({ srcHgl, name, lines, offset, pos }: ArrayElement<TypeDuplicate['files']>) {
  const { phrase } = useSearchPhrase();
  const code = splitLines(
    highlightPhrase(
      highlightDefinition(
        srcHgl || EMPTY_ROOT,
        { offset, pos },
      ),
      phrase,
    )
  );
  const snippet: Snippet = {
    name,
    lang: 'ts',
    code,
  };
  const linesMarkup = snippet.code.children.map((token, idx) => (
    <TokenElement
      key={idx}
      token={token}
    />
  ));
  return (
    <div className="snippet">
      <Lines
        start={lines[0]}
        type="lineNo"
        lines={linesMarkup}
      />
    </div>
  );
}