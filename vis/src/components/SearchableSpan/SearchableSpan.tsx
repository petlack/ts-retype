import './SearchableSpan.scss';

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

export function SearchableSpan({ className = '', query, value }: { className?: string, query: string, value: string }) {
  const match = findSubstringIndex(value.toLowerCase(), query.toLowerCase());
  if (!match) {
    return <span className={className}>{value}</span>;
  }
  const [start, end] = match;
  const left = value.substring(0, start);
  const found = value.substring(start, end + 1);
  const right = value.slice(end + 1);
  return (
    <span className={className}>
      <span>{left}</span>
      <span className="found">{found}</span>
      <span>{right}</span>
    </span>
  );
}