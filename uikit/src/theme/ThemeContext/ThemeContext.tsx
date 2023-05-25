import React, { FC, createContext, useMemo, PropsWithChildren } from 'react';
import { merge } from 'theme-ui';
import { ThemeProvider as ThemeUIProvider, Theme } from 'theme-ui';

import { theme as defaultTheme } from './theme';

export interface ThemeContextProps {
  theme?: Theme;
}
export const ThemeContext = createContext<ThemeContextProps>({});

export interface ThemeProviderProps {
  /**
   * components to customize the markdown display.
   */
  theme?: Theme;
}

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  theme: customTheme,
  children,
}) => {
  const theme = useMemo(() => {
    return customTheme ? merge(defaultTheme, customTheme) : defaultTheme;
  }, [customTheme]);
  console.log({ theme });
  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      <ThemeUIProvider
        theme={theme}
      >
        {children}
      </ThemeUIProvider>
    </ThemeContext.Provider>
  );
};
