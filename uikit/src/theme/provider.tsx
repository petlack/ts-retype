import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './context';
import applyCssVariables from './cssVariables';
import { Theme } from './types/theme';

export type ThemeProviderProps = {
  children: JSX.Element;
  theme: Theme;
}

export function ThemeProvider({
  children, theme: initialTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(initialTheme);
  const value = useMemo(() => ({
    theme,
    setTheme: (theme: Theme) => { setTheme(theme); },
  }), [theme]);
  useEffect(() => {
    applyCssVariables(theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}