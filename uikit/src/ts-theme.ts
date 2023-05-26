import { darken } from '@theme-ui/color';
import { Termix, palette } from './termix';

const primary = '#0a799e';
const accent = '#c68726';

export const theme: Termix = {
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
    ...palette('latte'),
    primary: primary,
    accent: accent,
    modes: {
      dark: palette('mocha'),
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
