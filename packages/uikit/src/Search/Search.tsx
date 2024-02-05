import { FC } from 'react';

export type SearchProps = {
  query: string;
  setQuery: (x: string) => void;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16}>
        <path stroke="currentColor" fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
);

export const Search: FC<SearchProps> = ({ query, setQuery }) => {
    return (
        <div className="relative flex flex-1 max-w-xl">
            <label htmlFor="search" className="flex items-center px-4 sr-only">Search</label>
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none cursor-default">
                <SearchIcon />
            </div>
            <input
                id="search"
                name="search"
                className="block w-full flex-1 bg-transparent text-foreground font-mono text-lg outline-none focus:bg-accent-50 placeholder-opacity-60 placeholder-current lock px-4 py-2 ps-10 text-neutral-900 border border-neutral-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                value={query}
                onChange={e => setQuery(e.currentTarget?.value)}
                placeholder='Search ...'
            />
        </div>
    );
};
