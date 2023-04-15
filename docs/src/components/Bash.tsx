import { Snippet, Token } from '../../../src/types/snippet';
import { Lines } from './Lines';
import { TokenElement } from './Token';
import { Window } from './Window';

export type BashProps = {
  children: string;
  theme: 'dark' | 'light';
}

function parseBash(code: string): Snippet {
  const lines = code.split('\n')
    .map(line => [
      line.trim().startsWith('#') ?
      {
        type: 'element',
        properties: { className: ['token', 'comment'] },
        children: [{ type: 'text', value: line }],
      } as Token :
      {
        type: 'text',
        value: line,
      } as Token,
      { type: 'newline' } as Token
    ])
    .reduce((res, item) => [...res, ...item], []);

  return {
    name: 'bash',
    lang: 'bash',
    code: {
      type: 'root',
      children: lines.slice(0, -1),
    },
  };
}

export function Bash({ children, theme }: BashProps) {
  const snippet = parseBash(children);
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