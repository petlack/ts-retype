import { createContext } from 'react';
import { Standard } from '../types/standard';
import { Theme } from '../types/theme';
import { ThemeMode } from './provider';

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: Standard,
  setTheme: () => {
    /* empty */
  },
});
