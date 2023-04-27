import { useCallback, useRef } from 'react';
import './Search.scss';

export type SearchProps = {
  query: string;
  setQuery: (x: string) => void;
}

export function Search({ query, setQuery }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="search">
      <button type="submit" onClick={focusInput} className="btn btn__secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </button>
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Search ..."
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  );
}