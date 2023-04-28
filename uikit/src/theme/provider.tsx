import { ThemeContext } from './context';
import useCssVariables from './useCssVariables';
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
  const theme = namedTheme(
    mode,
    withFonts({ body, heading, mono }, fromColors({ accent, second, mode })),
  );
  const value = {
    theme,
    setTheme: () => { /* */ },
  };
  useCssVariables(theme);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}