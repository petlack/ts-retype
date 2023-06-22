import { Color } from './theme/types/theme';
import { Termix, palette } from './termix';

const primary = '#0a799e';
const accent = '#c68726';

const body = '"Nunito Sans", sans-serif';
const heading = '"Exo 2", sans-serif';
const mono = '"Fira Code", monospace';
window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
export function colorScale(name: string, scale: Color) {
  return Object.fromEntries(Object.entries(scale).map(([key, value]) => [`${name}-${key}`, value]));
}

const light = palette('latte');
const dark = palette('mocha');

export const theme: Termix = {
  config: {
    // initialColorModeName: 'dark',
  },

  fonts: {
    body,
    heading,
    monospace: mono,
  },

  colors: {
    ...light,
    background: light.mantle,
    primary,
    accent,
    modes: {
      dark: {
        ...dark,
        background: dark.mantle,
        primary,
        accent,
      },
    },
  },

  styles: {
    root: {
      bg: 'background',
      color: 'text',
    },
  },

  // cards: {
  //   primary: {
  //     padding: 4,
  //     color: 'text',
  //     bg: 'base',
  //     display: 'flex',
  //     flexDirection: 'column',
  //     gap: 4,
  //     borderRadius: 'lg',
  //   },
  // },

  // buttons: {
  //   plain: {
  //     color: 'text',
  //     '&:hover': {
  //       color: 'sky',
  //     },
  //   },
  //   icon: {
  //     ph: 2,
  //     pw: 1,
  //   },
  //   primary: {
  //     color: 'text',
  //     bg: 'primary',
  //   },
  //   danger: {
  //     color: 'white',
  //     bg: 'red',
  //     '&:hover': {
  //       bg: 'red-200',
  //     },
  //   },
  //   secondary: {
  //     color: 'background',
  //     bg: 'secondary',
  //     '&:hover': {
  //       bg: 'sky',
  //     },
  //   },
  // },

  // forms: {
  //   input: {
  //     px: 3,
  //     py: 1,
  //     borderColor: 'overlay2',
  //     borderRadius: 'md',
  //   },
  // },
};
