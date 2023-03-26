import { Code } from './Code';

export type WithBashProps = {
  children: JSX.Element | JSX.Element[];
}

export function WithBash({ children }: WithBashProps) {
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