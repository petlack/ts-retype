import { Window } from './Window';
import { TokenElement } from './Token';
import type { Snippet } from '@ts-retype/retype';
import { Lines } from './Lines';
import { splitLines } from '@ts-retype/retype/dist/snippet';

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
    code: splitLines(snippet.code),
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