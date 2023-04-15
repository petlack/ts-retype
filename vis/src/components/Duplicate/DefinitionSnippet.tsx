import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import { flattenTokens, insertNewlines, splitLines, TokenElement } from '../../../../docs/src/components/Token';
import { Lines } from '../../../../docs/src/components/Lines';
import { Snippet, TokenRoot } from '../../../../src/types/snippet';
import './DefinitionSnippet.scss';

const EMPTY_ROOT: TokenRoot = { type: 'root', children: [] };

export function DefinitionSnippet({ srcHgl, name, lines }: ArrayElement<TypeDuplicate['files']>) {
  const snippet: Snippet = {
    name,
    lang: 'ts',
    code: splitLines(insertNewlines(flattenTokens(srcHgl || EMPTY_ROOT))),
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