import { Window } from './Window';
import { flattenTokens, insertNewlines, splitLines, TokenElement } from './Token';
import { Snippet } from '@ts-retype/retype/src/types/snippet';
import { Lines } from './Lines';

export type TsSnippetProps = {
  start: number;
  name: string;
  theme: 'light' | 'dark';
  snippet: Snippet;
  responsive?: boolean;
}

export function TsSnippet({ start, name, snippet, theme, responsive = false }: TsSnippetProps) {
  const sn: Snippet = {
    name,
    lang: 'ts',
    code: splitLines(insertNewlines(flattenTokens(snippet.code))),
  };
  const linesMarkup = sn.code.children.map((token, idx) => (
    <TokenElement
      key={idx}
      token={token}
    />
  ));
  return (
    <Window
      responsive={responsive}
      name={name}
      theme={theme}
    >
      <Lines
        type="lineNo"
        start={start}
        lines={linesMarkup}
      />
    </Window>
  );
}