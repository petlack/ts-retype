import { Window } from './Window';
import { WithLineNumbers } from './WithLineNumbers';
import { toColorTokens } from '../format';

export type SnippetProps = {
  start: number;
  name: string;
  code: string;
  theme: 'light' | 'dark';
  responsive?: boolean;
}

export function Snippet({ start, name, code, theme, responsive = false }: SnippetProps) {
  const codeMarkup = toColorTokens(code, theme).map(([[className], chunk], idx) => (
    <span key={idx} className={`chunk ${className}`}>{chunk}</span>
  ));
  // const lines = [...Array(code.split('\n').length).keys()].map(i => i + start).join(' ');
  return (
    <>
      <Window
        responsive={responsive}
        name={name}
        theme={theme}
      >
        <WithLineNumbers
          start={start}
          lines={code.split('\n').length}
        >
          {codeMarkup}
        </WithLineNumbers>
      </Window>
      {/* <div className={`snippet ${theme}`}>
        <div className="header">
          <div className="icons">
            <span className="icon red"></span>
            <span className="icon yellow"></span>
            <span className="icon green"></span>
          </div>
          <div className="name">{name}</div>
        </div>
        <div className="editor">
          <pre className="lines">
            {lines}
          </pre>
          <pre className="code">{codeMarkup}</pre>
        </div>
      </div> */}
    </>
  );
}