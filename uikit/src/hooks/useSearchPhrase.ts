import { createContext, useContext } from 'react';

type SearchPhrase = {
  phrase: string;
};

export const SearchPhraseContext = createContext<SearchPhrase>({ phrase: '' });

export const SearchPhraseProvider = SearchPhraseContext.Provider;

export function useSearchPhrase() {
  const { phrase } = useContext(SearchPhraseContext);
  return { phrase };
}
