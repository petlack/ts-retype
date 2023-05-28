import { Termix, palette } from '@ts-retype/uikit';

const primary = '#0a799e';
const accent = '#c68726';

export const theme: Termix = {
  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: '"Exo 2", sans-serif',
    monospace: '"Fira Code",Menlo, monospace',
  },

  colors: {
    ...palette('latte'),
    primary,
    accent,
    modes: {
      dark: {
        ...palette('mocha'),
        primary,
        accent,
      },
    },
  },

  styles: {
    root: {
      bg: 'mantle',
      color: 'text',
    },
  },
};
