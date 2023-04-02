import { Snippet, Token, toTokenLines } from './Token';
import { Window } from './Window';
import { WithBash } from './WithBash';

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
      {
        type: 'text', value: '\n',
      } as Token
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
  const lines = toTokenLines(parseBash(children));
  // const childrenMarkup = children.split('\n').map((line, idx) => <span key={idx}>{`${line}\n`}</span>);
  return (
    <Window theme={theme} name="bash" showHeader={false}>
      <WithBash lines={lines} />
    </Window>
  );
}