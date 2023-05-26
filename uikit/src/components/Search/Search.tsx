import { FC, useCallback, useRef } from 'react';
import { Grid, Input, Label } from 'theme-ui';
import './Search.scss';

export type SearchProps = {
  query: string;
  setQuery: (x: string) => void;
}

// export function SearchOld({ query, setQuery }: SearchProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const focusInput = useCallback(() => {
//     inputRef.current?.focus();
//   }, []);
//   return (
//     <div className="search">
//       <button type="submit" onClick={focusInput} className="btn btn__secondary">
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//           <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
//         </svg>
//       </button>
//       <input
//         ref={inputRef}
//         type="text"
//         value={query}
//         placeholder="Search ..."
//         onChange={e => setQuery(e.target.value)}
//       />
//     </div>
//   );
// }
//
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16}>
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
  </svg>
);

export const Search: FC<SearchProps> = ({ query, setQuery }) => {
  return (
    <Grid sx={{ gridTemplateColumns: 'min-content 1fr', flex: 1, gap: 3, alignItems: 'center' }}>
      <Label htmlFor="search"><SearchIcon /></Label>
      <Input id="search" name="search" value={query} onChange={e => setQuery(e.currentTarget?.value)} placeholder='Search ...' sx={{
      }} />
    </Grid>
  );
};

