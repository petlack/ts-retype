import { Code } from './Code';
import { Window } from './Window';
import { toTokenElements } from './Token';
import { Snippet } from '../../../src/types/snippet';

export type JsTsCodeProps = {
  snippet: Snippet;
  theme: 'dark' | 'light';
}

export function JsTsCode({ theme, snippet }: JsTsCodeProps) {
  const childrenMarkup = toTokenElements(snippet);
  return (
    <Window theme={theme} name="bash" showHeader={false}>
      <div className={theme}>
        <Code>{childrenMarkup}</Code>
      </div>
    </Window>
  );
}