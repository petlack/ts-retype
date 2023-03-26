import { toColorTokens } from '../format';
import { Window } from './Window';

import './Bash.styl';
import { WithBash } from './WithBash';

export type BashProps = {
  children: string;
  theme: 'dark' | 'light';
}

function parseBash(code: string): string {
  const lines = code.split('\n')
    .map(line => line.trim().startsWith('#') ? `$com$${line}` : `$gen$${line}`);
  return lines.join('\n');
}

export function Bash({ children, theme }: BashProps) {
  const tokens = toColorTokens(parseBash(children), theme);
  const childrenMarkup = tokens.map(([[className], chunk], idx) => (
    <span key={idx} className={`chunk ${className}`}>{chunk}</span>
  ));
  // const childrenMarkup = children.split('\n').map((line, idx) => <span key={idx}>{`${line}\n`}</span>);
  return (
    <div className="bash">
      <Window theme={theme} name="bash" showHeader={false}>
        <WithBash>
          {childrenMarkup}
        </WithBash>
      </Window>
    </div>
  );
}