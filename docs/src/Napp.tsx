import './Napp.styl';

import * as Snippets from './generated/snippets';
import type { Snippet, Token } from '@ts-retype/retype';

type NappProps = {
  snippet: Snippet;
}

function renderToken(token: Token) {
  if (token.type === 'element') {
    return <span className={token.properties?.className.join(' ')}>{token.children.map(ch => ch.value).join(' ')}</span>;
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
      <Napp snippet={Snippets.Snippet_type as Snippet} />
      <Napp snippet={Snippets.Snippet_ScanProps as Snippet} />
      <Napp snippet={Snippets.Snippet_TypeDuplicate as Snippet} />
      <Napp snippet={Snippets.Snippet_duplicate as Snippet} />
      <Napp snippet={Snippets.Snippet_function as Snippet} />
      <Napp snippet={Snippets.Snippet_interface as Snippet} />
      <Napp snippet={Snippets.Snippet_retyperc as Snippet} />
    </div>
  );
}