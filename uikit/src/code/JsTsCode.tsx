import { Code } from './Code';
import { Window } from './Window';
import { TokenElement } from './Token';
import type { Snippet } from '@ts-retype/retype';
import { splitLines } from '@ts-retype/retype/dist/snippet';

export type JsTsCodeProps = {
  snippet: Snippet;
  theme: 'dark' | 'light';
}

export function JsTsCode({ theme, snippet }: JsTsCodeProps) {
  const sn: Snippet = {
    name: '',
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
    <Window theme={theme} name="bash" showHeader={false}>
      <div className={theme}>
        <Code>{linesMarkup}</Code>
      </div>
    </Window>
  );
}