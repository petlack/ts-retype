import './Snippet.styl';

const colorRegex = /\$[a-z]\$/g;

function toColorTokens(src: string) {
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

  const colors = {
    g: 'gray',
    p: 'purple',
    y: 'yellow',
    o: 'orange',
    r: 'red',
    w: 'white',
    b: 'blue',
  };

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
}

export function Snippet({ start ,name, code }: SnippetProps) {
  const codeMarkup = toColorTokens(code).map(([color, chunk], idx) => (
    <span key={idx} className={`chunk ${color}`}>{chunk}</span>
  ));
  const lines = [...Array(code.split('\n').length).keys()].map(i => i + start).join(' ');
  return (
    <div className="snippet">
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
    </div>
  );
}