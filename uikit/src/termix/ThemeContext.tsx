import { FC, createContext, useMemo, PropsWithChildren } from 'react';
import { ThemeProvider as ThemeUIProvider, merge, InitializeColorMode } from 'theme-ui';
import { Termix } from './types.js';
import { theme as defaultTheme } from './theme.js';

export interface ThemeContextProps {
  theme?: Termix;
}
export const ThemeContext = createContext<ThemeContextProps>({});

export interface ThemeProviderProps {
  theme?: Termix;
}

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  theme: customTheme,
  children,
}) => {
  const theme = useMemo(() => {
    return customTheme ? merge(defaultTheme, customTheme) : defaultTheme;
  }, [customTheme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      <ThemeUIProvider
        theme={theme}
      >
        <InitializeColorMode />
        {children}
      </ThemeUIProvider>
    </ThemeContext.Provider>
  );
};
