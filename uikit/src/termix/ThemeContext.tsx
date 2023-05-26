import { FC, createContext, useMemo, PropsWithChildren, useEffect } from 'react';
import { merge, InitializeColorMode } from 'theme-ui';
// import { ThemeUIProvider } from 'theme/theme-provider';
import { ThemeProvider as ThemeUIProvider } from 'theme-ui';
import { Termix } from './types.js';
import { theme as defaultTheme } from './theme.js';
import applyCssVariables from '~/theme/cssVariables';
import { generateTheme } from '~/theme/generate';

export interface ThemeContextProps {
  theme?: Termix;
}
export const ThemeContext = createContext<ThemeContextProps>({});

export interface ThemeProviderProps {
  theme?: Termix;
}

const primary = '#0a799e';
const accent = '#c68726';
const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  theme: customTheme,
  children,
}) => {
  const theme = useMemo(() => {
    return customTheme ? merge(defaultTheme, customTheme) : defaultTheme;
  }, [customTheme]);

  const varsTheme = generateTheme({ body, heading, mono, mode: 'light', accent: primary, second: accent });

  console.log({ varsTheme, theme });
  varsTheme.colors = {
    ...varsTheme.colors,
    'sx-token': theme.colors?.text as string,
    'sx-builtin': theme.colors?.red as string,
    'sx-class-name': theme.colors?.yellow as string,
    'sx-comment': theme.colors?.overlay0 as string,
    'sx-function': theme.colors?.blue as string,
    'sx-keyword': theme.colors?.mauve as string,
    'sx-number': theme.colors?.peach as string,
    'sx-operator': theme.colors?.sky as string,
    'sx-property': theme.colors?.text as string,
    'sx-punctuation': theme.colors?.overlay2 as string,
    'sx-string': theme.colors?.green as string,
    'bg-topbar': varsTheme.colors['bg'],
    'bg-main': varsTheme.colors['bg'],
    'bg-code': varsTheme.colors.neutral[25] as string,
    'fg-text': varsTheme.colors['fg'],
    'fg-title': varsTheme.colors['neutral'][600] as string,
    'fg-code': varsTheme.colors['fg'],
    'bg-title': varsTheme.colors.accent[50] as string,
    'bg-explorer': varsTheme.colors.neutral[50] as string,
    'bg-explorer-selected': varsTheme.colors.accent[100] as string,
    'bg-snippet': varsTheme.colors.neutral[50] as string,
    'bg-snippet-highlighted': varsTheme.colors.accent[100] as string,
  };

  console.log('new', { varsTheme });

  useEffect(() => {
    applyCssVariables(varsTheme);
  }, [varsTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme as Termix,
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
