export function WithLineNumbers({ children, start, lines }: { children: JSX.Element[], start: number, lines: number }) {
  const lineNos = [...Array(lines).keys()].map(i => i + start).join(' ');
  return (
    <>
      <pre className="lines lines-numbers">
        {lineNos}
      </pre>
      <Code>{children}</Code>
    </>
  );
}

export function WithBash({ children }: { children: WindowProps['children'] }) {
  const linesCount = 'length' in children ? children.length : 1;
  const lines = [...Array(linesCount).keys()].map(() => '$').join(' ');
  return (
    <>
      <pre className="lines">
        {lines}
      </pre>
      <Code>{children}</Code>
    </>
  );
}

export function Code({ children }: { children: WindowProps['children'] }) {
  return (
    <pre className="code">{children}</pre>
  );
}

export type WindowProps = {
  children: JSX.Element | JSX.Element[];
  header?: JSX.Element | JSX.Element[];
  showHeader?: boolean;
  responsive?: boolean;
  theme: 'dark' | 'light';
  name: string;
}

export function Window({ name, theme, showHeader = true, header, children, responsive = false }: WindowProps) {
  const headerMarkup = (
    <div className="header">
      <div className="icons">
        <span className="icon red"></span>
        <span className="icon yellow"></span>
        <span className="icon green"></span>
      </div>
      <div className="name">{name}</div>
    </div>
  );
  return (
    <div className={`window ${theme} ${responsive ? 'window-responsive' : ''}`}>
      {showHeader ? headerMarkup : <></>}
      {header ? header : <></>}
      <div className={'editor'}>
        {children}
      </div>
    </div>
  );
}