import { darken } from '@theme-ui/color';
import { toCssVars } from '~/theme/cssVariables';
import { generateTheme } from '~/theme/generate';
import { ColorScale } from '~/theme/types';
import { Termix, palette } from './termix';

const primary = '#0a799e';
const accent = '#c68726';

const body = "'Noto Sans', sans-serif";
const heading = "'Exo 2', sans-serif";
const mono = "'Fira Code', monospace";
const preferredTheme =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const light = generateTheme({
  body,
  heading,
  mono,
  mode: 'light',
  accent: primary,
  second: accent,
});
const dark = generateTheme({ body, heading, mono, mode: 'dark', accent: primary, second: accent });

console.log({ light, dark });

const lightCssVars = toCssVars(light);

console.log({ lightCssVars });

function colorScale(name: string, scale: ColorScale) {
  return Object.fromEntries(Object.entries(scale).map(([key, value]) => [`${name}-${key}`, value]));
}

export const theme: Termix = {
  config: {
    // initialColorModeName: 'dark',
  },

  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },

  colors: {
    ...palette('latte'),
    primary,
    accent,
    ...colorScale('neutral', light.colors.neutral),
    ...colorScale('primary', light.colors.accent),
    ...colorScale('accent', light.colors.second),
    modes: {
      dark: {
        ...palette('mocha'),
        primary,
        accent,
        ...colorScale('neutral', dark.colors.neutral),
        ...colorScale('primary', dark.colors.accent),
        ...colorScale('accent', dark.colors.second),
      },
    },
  },

  styles: {
    root: {
      padding: 4,
      bg: 'mantle',
      color: 'text',
    },
  },

  cards: {
    primary: {
      padding: 4,
      color: 'text',
      bg: 'base',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      borderRadius: 'lg',
    },
  },

  buttons: {
    plain: {
      color: 'text',
      '&:hover': {
        color: 'sky',
      },
    },
    icon: {
      ph: 2,
      pw: 1,
    },
    primary: {
      color: 'white',
      bg: 'primary',
    },
    danger: {
      color: 'white',
      bg: 'red',
      '&:hover': {
        bg: darken('red', 0.1),
      },
    },
    secondary: {
      color: 'background',
      bg: 'secondary',
      '&:hover': {
        bg: 'sky',
      },
    },
  },

  forms: {
    input: {
      px: 3,
      py: 1,
      borderColor: 'overlay2',
      transition: 'box-shadow 150ms ease-in',
      borderRadius: 'md',
      fontFamily: 'body',
      '&:focus': {
        borderColor: 'primary',
        borderWidth: 1,
        boxShadow: (t) =>
          `${t.colors?.primary} 0px 0px 5px -2px, ${t.colors?.primary} 0px 0px 1px 0px`,
        outline: 'none',
      },
    },
  },

  tags: {
    default: {
      lineHeight: 1,
    },

    green: {
      color: 'white',
      background: 'green',
      borderWidth: 1,
    },
    red: {
      color: 'white',
      background: 'red',
    },
    yellow: {
      color: 'white',
      background: 'yellow',
    },
    blue: {
      color: 'white',
      background: 'sky',
    },
  },
};
