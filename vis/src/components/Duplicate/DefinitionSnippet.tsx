import { ArrayElement, TypeDuplicate } from '@ts-retype/retype/src/types';
import { flattenTokens, insertNewlines, splitLines, TokenElement } from '@ts-retype/uikit/src/code/Token';
import { Lines } from '@ts-retype/uikit/src/code/Lines';
import { Snippet, TokenRoot } from '@ts-retype/retype/src/types/snippet';
import { useSearchPhrase } from '../../hooks/useSearchPhrase';
import { highlightDefinition, highlightPhrase } from '../../model/snippet';
import './DefinitionSnippet.scss';

const EMPTY_ROOT: TokenRoot = { type: 'root', children: [] };

export function DefinitionSnippet({ srcHgl, name, lines, offset, pos }: ArrayElement<TypeDuplicate['files']>) {
  const { phrase } = useSearchPhrase();
  const code = splitLines(
    highlightPhrase(
      highlightDefinition(
        insertNewlines(
          flattenTokens(
            srcHgl || EMPTY_ROOT
          )
        ),
        { lines, offset, pos },
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