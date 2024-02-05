import { FC } from 'react';

export type SearchProps = {
  query: string;
  setQuery: (x: string) => void;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16}>
        <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
);

export const Search: FC<SearchProps> = ({ query, setQuery }) => {
    return (
        <div className="flex flex-row flex-1 max-w-xl mx-auto">
            <label htmlFor="search" className="flex items-center px-4">
                <SearchIcon />
            </label>
            <input
                id="search"
                name="search"
                className="flex-1 bg-transparent text-foreground font-mono text-lg p-4 outline-none focus:bg-neutral-50 placeholder-opacity-60 placeholder-current"
                value={query}
                onChange={e => setQuery(e.currentTarget?.value)}
                placeholder='Search ...'
            />
        </div>
    );
};
