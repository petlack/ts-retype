import { Window, Code, WithLineNumbers } from './Window';

import './Snippet.styl';

const colorRegex = /\$[a-z]+\$/g;

const themes = {
  dark: {
    com: 'gray thin',
    typ: 'yellow',
    var: 'yellow',
    jbr: 'purple thin',
    kew: 'purple',
    awa: 'purple',
    pun: 'white thin',
    fun: 'blue',
    bra: 'orange thin',
    jkw: 'red',
    lva: 'red',
    w: 'white',
  },
  light: {
    com: 'grayLight thin',
    typ: 'green',
    var: 'orange thin',
    jbr: 'green thin',
    kew: 'orange',
    awa: 'purple',
    pun: 'gray thin',
    fun: 'purple',
    bra: 'blueDark thin',
    jkw: 'blueDark',
    lva: 'blueDark thin',
    w: 'white',
  },
};

function toColorTokens(src: string, theme: 'light' | 'dark') {
  const tokens = [];
  let match;
  let lastIndex = 0;
  const result = [];
  while ((match = colorRegex.exec(src))) {
    tokens.push(match[0]);
    result.push(src.slice(lastIndex, match.index));
    lastIndex = match.index + match[0].length;
  }
  result.push(src.slice(lastIndex));

  const colors = themes[theme];

  const coloredTokens = [];

  for (const [idx, token] of Object.entries(tokens)) {
    const color = colors[(token.replaceAll('$', '') || 'w') as keyof typeof colors];
    coloredTokens.push([color, result[+idx+1]]);
  }
  return coloredTokens;
}

export type SnippetProps = {
  start: number;
  name: string;
  code: string;
  theme: 'light' | 'dark';
}

export function Snippet({ start, name, code, theme }: SnippetProps) {
  const codeMarkup = toColorTokens(code, theme).map(([color, chunk], idx) => (
    <span key={idx} className={`chunk ${color}`}>{chunk}</span>
  ));
  // const lines = [...Array(code.split('\n').length).keys()].map(i => i + start).join(' ');
  return (
    <>
      <Window
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