import { toColorTokens } from '../format';
import { Code, Window, WindowProps } from './Window';

export type BashProps = {
  children: string;
}

export function WithBash({ children }: { children: WindowProps['children'] }) {
  const linesCount = 'length' in children ? children.length : 1;
  const lines = [...Array(linesCount).keys()].map((_, idx) => <span key={idx}>$</span>);
  return (
    <>
      <pre className="lines">
        {lines}
      </pre>
      <Code>{children}</Code>
    </>
  );
}

function parseBash(code: string): string {
  const lines = code.split('\n')
    .map(line => line.trim().startsWith('#') ? `$com$${line}` : `$gen$${line}`);
  return lines.join('\n');
}

export function Bash({ children }: BashProps) {
  const tokens = toColorTokens(parseBash(children), 'light');
  const childrenMarkup = tokens.map(([[className], chunk], idx) => (
    <span key={idx} className={`chunk ${className}`}>{chunk}</span>
  ));
  // const childrenMarkup = children.split('\n').map((line, idx) => <span key={idx}>{`${line}\n`}</span>);
  return (
    <div className="bash">
      <Window theme="light" name="bash" showHeader={false}>
        <WithBash>
          {childrenMarkup}
        </WithBash>
      </Window>
    </div>
  );
}