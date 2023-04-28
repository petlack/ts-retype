import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './context';
import applyCssVariables from './cssVariables';
import { fromColors, namedTheme, withFonts } from './builder';

export type ThemeMode = 'light' | 'dark';

export type ThemeProviderProps = {
  accent: string;
  body: string;
  children: JSX.Element;
  heading: string;
  mode: ThemeMode;
  mono: string;
  second: string;
}

export function ThemeProvider({
  accent, body, children, heading, mode, mono, second,
}: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(mode);
  const theme = useMemo(() => namedTheme(
    themeMode,
    withFonts({ body, heading, mono }, fromColors({ accent, second, mode: themeMode })),
  ), [themeMode]);
  const value = useMemo(() => ({
    theme,
    setTheme: (mode: ThemeMode) => { setThemeMode(mode); },
  }), [themeMode]);
  useEffect(() => {
    applyCssVariables(theme);
  }, [themeMode]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}