import { createContext } from 'react';
import { Standard } from './types/standard';
import { Theme } from './types/theme';

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (mode: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: Standard,
  setTheme: () => {
    /* empty */
  },
});
