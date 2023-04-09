import './Napp.styl';

import Snippets from './generated/snippets';
import { Snippet, Token } from '../../src/types/snippet';

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
      <Napp snippet={Snippets.ScanProps as Snippet} />
      <Napp snippet={Snippets.TypeDuplicate as Snippet} />
      <Napp snippet={Snippets.duplicate as Snippet} />
      <Napp snippet={Snippets.function as Snippet} />
      <Napp snippet={Snippets.interface as Snippet} />
      <Napp snippet={Snippets.retyperc as Snippet} />
    </div>
  );
}