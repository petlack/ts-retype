import { darken, lighten } from '@theme-ui/color';
import { TermixTheme } from './theme/theme';
import { variants, labels } from './theme/ThemeContext/palette.js';

const primary = '#0a799e';
const accent = '#c68726';

const paletteColors = (variantName: keyof typeof variants) =>
  Object.fromEntries(Object.entries(variants[variantName]).map(([key, value]) => [key, value.hsl]));

export const theme: TermixTheme = {
  config: {
    useBorderBox: true,
    initialColorModeName: 'light',
  },

  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },

  colors: {
    ...paletteColors('latte'),
    primary: primary,
    accent: accent,
    modes: {
      dark: paletteColors('mocha'),
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
      gap: 3,
      borderRadius: 'lg',
    },
  },

  buttons: {
    plain: {
      cursor: 'pointer',
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
      cursor: 'pointer',
      color: 'white',
      bg: 'primary',
      '&:hover': {
        bg: 'sky',
      },
    },
    danger: {
      cursor: 'pointer',
      color: 'white',
      bg: 'red',
      '&:hover': {
        bg: darken('red', 0.1),
      },
    },
    secondary: {
      cursor: 'pointer',
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
      borderColor: 'overlay2',
      transition: 'box-shadow 150ms ease-in',
      borderRadius: 'md',
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
      py: 1,
      px: 2,
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

    dense: {
      py: 1,
      px: 2,
    },
    airy: {
      py: 1,
      px: 2,
    },
  },
};
