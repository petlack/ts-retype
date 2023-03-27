import { Window } from './Window';
import { WithLineNumbers } from './WithLineNumbers';
import { Snippet, toTokenLines } from './Token';

export type TsSnippetProps = {
  start: number;
  name: string;
  theme: 'light' | 'dark';
  snippet: Snippet;
  responsive?: boolean;
}

export function TsSnippet({ start, name, snippet, theme, responsive = false }: TsSnippetProps) {
  const lines = toTokenLines(snippet).slice(0, -1);
  return (
    <Window
      responsive={responsive}
      name={name}
      theme={theme}
    >
      <WithLineNumbers
        start={start}
        lines={lines}
      />
    </Window>
  );
}