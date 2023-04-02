import './Napp.styl';

import Snippets from './generated/snippets';

type Token = (
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

type Snippet = {
  name: string;
  lang: string;
  code: {
    type: string;
    children: Token[];
  };
};


type NappProps = {
  snippet: Snippet;
}

function renderToken(token: Token) {
  if (token.type === 'element') {
    return <span className={token.properties.className.join(' ')}>{token.children.map(ch => ch.value).join(' ')}</span>;
  }
  return <span>{token.value}</span>;
}

function Napp({ snippet }: NappProps) {
  const markup = snippet.code.children.map(renderToken);
  return (
    <pre>{markup}</pre>
  );
}

export default function() {
  return (
    <div>
      <Napp snippet={Snippets.type as Snippet} />
      <Napp snippet={Snippets.RetypeArgs as Snippet} />
      <Napp snippet={Snippets.TypeDuplicate as Snippet} />
      <Napp snippet={Snippets.duplicate as Snippet} />
      <Napp snippet={Snippets.function as Snippet} />
      <Napp snippet={Snippets.interface as Snippet} />
      <Napp snippet={Snippets.retyperc as Snippet} />
    </div>
  );
}