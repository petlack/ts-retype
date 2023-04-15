import { Code } from './Code';
import { Window } from './Window';
import { flattenTokens, insertNewlines, splitLines, TokenElement } from './Token';
import { Snippet } from '../../../src/types/snippet';

export type JsTsCodeProps = {
  snippet: Snippet;
  theme: 'dark' | 'light';
}

export function JsTsCode({ theme, snippet }: JsTsCodeProps) {
  const sn: Snippet = {
    name: '',
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
    <Window theme={theme} name="bash" showHeader={false}>
      <div className={theme}>
        <Code>{linesMarkup}</Code>
      </div>
    </Window>
  );
}