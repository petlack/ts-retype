import { FC, createContext, useMemo, PropsWithChildren, useEffect } from 'react';
import { merge, InitializeColorMode } from 'theme-ui';
// import { ThemeUIProvider } from 'theme/theme-provider';
import { ThemeProvider as ThemeUIProvider } from 'theme-ui';
import { Termix } from './types.js';
import { theme as defaultTheme } from './theme.js';
import applyCssVariables from '~/theme/cssVariables';
import { generateTheme } from '~/theme/generate';
import { Color, ColorScale, Theme } from '~/theme/types/theme';

export interface ThemeContextProps {
  theme?: Termix;
}
export const ThemeContext = createContext<ThemeContextProps>({});

export interface ThemeProviderProps {
  theme?: Termix;
}

const primary = '#0a799e';
const accent = '#c68726';
const body = '\'Nunito Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';

function getColor(theme: Theme, name: keyof Theme['colors'], value: number): string {
  const color = theme.colors[name];
  if (typeof color === 'number') {
    return color.toString();
  }
  if (typeof color === 'string') {
    return color;
  }
  const scale = color;
  const shade = scale[value as keyof ColorScale] as Color | undefined;

  return shade?.toString() || color[100].toString() || 'transparent';
}

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  theme: customTheme,
  children,
}) => {
  const theme = useMemo(() => {
    return customTheme ? merge(defaultTheme, customTheme) : defaultTheme;
  }, [customTheme]);

  const varsTheme = generateTheme({ body, heading, mono, mode: 'light', accent: primary, second: accent });

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
    'bg-topbar': varsTheme.colors.bg,
    'bg-main': varsTheme.colors.bg,
    'bg-code': getColor(varsTheme, 'neutral', 25),
    'fg-text': varsTheme.colors.fg,
    'fg-title': getColor(varsTheme, 'neutral', 600),
    'fg-code': varsTheme.colors['fg'],
    'bg-title': getColor(varsTheme, 'accent', 50),
    'bg-explorer': getColor(varsTheme, 'neutral', 50),
    'bg-explorer-selected': getColor(varsTheme, 'accent', 100),
    'bg-snippet': getColor(varsTheme, 'neutral', 50),
    'bg-snippet-highlighted': getColor(varsTheme, 'accent', 100),
  };

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
