import { useSearchPhrase } from '../../hooks/useSearchPhrase';
import './SearchAwareText.scss';

function findSubstringIndex(str: string, substr: string): [number, number] | null {
  if (!substr || !substr.length) {
    return null;
  }
  const startIdx = str.indexOf(substr);
  if (startIdx === -1) {
    return null;
  }
  const endIdx = startIdx + substr.length - 1;
  return [startIdx, endIdx];
}

export type SearchAwareTextProps = {
    foundClassName?: string;
    children: string | number;
}

export function SearchAwareText({ foundClassName = 'sat--found', children }: SearchAwareTextProps): JSX.Element {
  const { phrase } = useSearchPhrase();
  const text = (children || '').toString();
  const match = findSubstringIndex(text.toLowerCase(), phrase.toLowerCase());
  if (!match) {
    return <>{text}</>;
  }
  const [start, end] = match;
  const left = text.substring(0, start);
  const found = text.substring(start, end + 1);
  const right = text.slice(end + 1);
  return (
    <>
      <span>{left}</span>
      <span className={foundClassName}>{found}</span>
      <span>{right}</span>
    </>
  );
}