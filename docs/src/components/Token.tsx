import './Token.styl';

export type Token = (
  {
      type: 'element';
      tagName: string;
      properties: { className: string[] };
      children: { type: string; value: string }[];
      value?: undefined;
    }
  | {
      type: 'text';
      value: string;
      tagName?: undefined;
      properties?: undefined;
      children?: undefined;
    }
);

export type Snippet = {
  name: string;
  lang: string;
  code: {
    type: string;
    children: Token[];
  };
};

export function toTokenElements(snippet: Snippet) {
  return snippet.code.children.map((token, idx) => <TokenElement key={idx} token={token} />);
}

export function TokenElement({ token }: { token: Token }) {
  if (token.type === 'element') {
    return (
      <span className={token.properties.className.join(' ')}>
        {token.children.map(ch => ch.value).join(' ')}
      </span>
    );
  }
  return (
    <span className="token">
      {token.value}
    </span>
  );
}