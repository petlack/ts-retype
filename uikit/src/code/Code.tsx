import './Code.scss';

export type CodeProps = {
  children: JSX.Element | JSX.Element[];
}

export function Code({ children }: CodeProps) {
  return (
    <pre className="code">{children}</pre>
  );
}