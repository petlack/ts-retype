import type { Snippet, Token, TokenRoot } from '@ts-retype/retype';
import { Lines } from './Lines';
import { TokenElement } from './Token';
import { Window } from './Window';
import { splitLines } from '@ts-retype/retype/dist/snippet';

export type BashProps = {
  children: string;
  theme: 'dark' | 'light';
}

export function Bash({ children, theme }: BashProps) {
  const src = children;

  const root = parseBash(src);
  const code = splitLines(root);
  const snippet: Snippet = {
    name: 'bash',
    lang: 'bash',
    code,
  };
  const linesMarkup = snippet.code.children.map((token, idx) => (
    <TokenElement
      key={idx}
      token={token}
    />
  ));
  return (
    <Window theme={theme} name="bash" showHeader={false}>
      <Lines type="custom" char="$" lines={linesMarkup} />
    </Window>
  );
}
