import { FC, createContext, useMemo, PropsWithChildren, useEffect } from 'react';
import { merge, InitializeColorMode, Theme as UITheme, useColorMode } from 'theme-ui';
// import { ThemeUIProvider } from 'theme/theme-provider';
import { ThemeProvider as ThemeUIProvider } from 'theme-ui';
import { Termix } from './types.js';
import { theme as defaultTheme } from './theme.js';
import applyCssVariables from '~/theme/cssVariables';
import { generateTheme } from '~/theme/generate';
import { Color, Theme } from '~/theme/types/theme';
import { ToastProvider } from '~/layouts';
import { paletteColorScales } from './termix.js';
import { ColorScale, desaturate } from './mixer.js';
import { omit } from 'ramda';

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
  const shade = scale[value as keyof typeof scale] as Color;

  return shade?.toString() || color[100].toString() || 'transparent';
}

function applyExtensions(base: UITheme, exts: ((t: UITheme) => UITheme)[]): UITheme {
  return exts.reduce((res, item) => item(res), base);
}

function mergeColors(base: UITheme, light: UITheme['colors'], dark: ColorScale): UITheme {
  return merge(
    base,
    {
      colors: {
        ...light,
        modes: {
          dark,
        },
      },
    }
  );
}

function withNeutralColor(base: UITheme): UITheme {
  if (!base.colors?.primary) {
    return base;
  }
  const neutral = desaturate(base.colors?.primary.toString());
  return mergeColors(base, { neutral }, { neutral });
}

function withColorScales(base: UITheme): UITheme {
  const lightScales = paletteColorScales('light', primary, omit(['modes'], base.colors));
  const darkScales = paletteColorScales('dark', primary, base.colors?.modes?.dark as ColorScale);
  const mergedTheme = mergeColors(
    base,
    lightScales,
    darkScales,
  );
  return mergedTheme;
}

function withSyntaxHighlightingColors(base: UITheme): UITheme {
  const lightColors = {
    'sx-token': 'var(--clr-text)',
    'sx-builtin': 'var(--clr-red)',
    'sx-class-name': 'var(--clr-yellow)',
    'sx-comment': 'var(--clr-overlay0)',
    'sx-function': 'var(--clr-blue)',
    'sx-keyword': 'var(--clr-mauve)',
    'sx-number': 'var(--clr-peach)',
    'sx-operator': 'var(--clr-sky)',
    'sx-property': 'var(--clr-text)',
    'sx-punctuation': 'var(--clr-overlay2)',
    'sx-string': 'var(--clr-green)',
  };
  const darkColors = {};
  return mergeColors(base, lightColors, darkColors);
}

function withTsRetypeColors(base: UITheme): UITheme {
  const light = {
    'bg': 'var(--clr-background)',
    'fg': 'var(--clr-text)',
    'bg-topbar': 'var(--clr-background)',
    'bg-main': 'var(--clr-mantle)',
    'bg-code': 'var(--clr-neutral-25)',
    'fg-text': 'var(--clr-text)',
    'fg-title': 'var(--clr-neutral-600)',
    'fg-code': 'var(--clr-text)',
    'bg-title': 'var(--clr-crust)',
    'bg-explorer': 'var(--clr-base)',
    'bg-explorer-selected': 'var(--clr-primary-100)',
    'bg-snippet': 'var(--clr-base)',
    'bg-snippet-highlighted': 'var(--clr-primary-100)',
  };
  const dark = {};
  return mergeColors(base, light, dark);
}

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  theme: customTheme,
  children,
}) => {
  const theme = useMemo(() => {
    const baseTheme = customTheme ? merge(defaultTheme, customTheme) : defaultTheme;
    const mergedTheme = applyExtensions(baseTheme, [
      withNeutralColor,
      withColorScales,
      withSyntaxHighlightingColors,
      withTsRetypeColors,
    ]);
    return mergedTheme;
  }, [customTheme]);


  const varsTheme = generateTheme({ body, heading, mono, mode: 'light', accent: primary, second: accent });

  varsTheme.colors = {
    ...varsTheme.colors,
  };

  // console.log({ theme, defaultTheme, customTheme, varsTheme });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    applyCssVariables({ ...varsTheme, ...theme });
  }, [theme]);

  return (
    <ThemeUIProvider
      theme={theme}
    >
      <ThemeContext.Provider
        value={{
          theme: theme as Termix,
        }}
      >
        <>
          <InitializeColorMode />
          {children}
          <ToastProvider />
        </>
      </ThemeContext.Provider>
    </ThemeUIProvider>
  );
};
