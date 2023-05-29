import { readableColor } from './mixer';
import { easeIn } from 'polished';
import { Theme } from 'theme-ui';
import { Termix } from './types';

const heading = {
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
};

export const theme: Termix = {
  useCustomProperties: false,
  config: {
    useBorderBox: true,
    initialColorModeName: 'light',
  },
  colors: {
    text: 'black',
    background: 'white',
    primary: 'hotpink',
    modes: {
      dark: {
        text: 'white',
        background: 'black',
        primary: 'hotpink',
      },
    },
  },

  fonts: {
    body: '"Nunito Sans",system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'Rockwell,medium-content-title-font,Georgia,Cambria,"Times New Roman",Times,serif',
    monospace: 'monospace',
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 42,
    '4xl': 48,
    '5xl': 64,
    '6xl': 96,
  },

  fontWeights: {
    thin: 200,
    body: 400,
    heading: 500,
    bold: 600,
    black: 800,
  },

  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },

  radii: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    max: '100vw',
  },

  space: {
    0: 0,
    [0.5]: 2,
    1: 4,
    [1.5]: 6,
    2: 8,
    [2.5]: 12,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
    8: 96,
    9: 128,
    10: 256,
    11: 512,
  },

  speeds: {
    slow: '4s',
    real: '1.5s',
    fast: '1s',
  },

  buttons: {
    primary: {
      cursor: 'pointer',
      color: 'text',
      fontFamily: 'body',
      '&>svg': {
        width: '1em',
        height: '1em',
      },
    },
    default: {
      // transitionProperty: 'background,color',
      // transition: '150ms ease-in',
      colorScheme: 'primary',
      variant: 'default',
      fill: 'solid',
      size: 'md',
      density: 'airy',
      weight: 'bold',
      corners: 'round',
      energy: 'live',
      mimic: 'tint',
    },

    disabled: {
      colorScheme: 'overlay1',
      cursor: 'not-allowed',
    },

    plain: {
      backgroundColor: 'transparent',
      color: 'primary',
      '&:hover': {
        bg: 'mantle',
      },
    },

    sm: {
      fontSize: 'sm',
      lineHeight: 1,
      px: '10px',
      py: 2,
      gap: 1,
    },
    md: {
      fontSize: 'md',
      lineHeight: 1,
      px: 3,
      py: '10px',
      gap: '10px',
    },
    lg: {
      fontSize: 'lg',
      px: '18px',
      py: '14px',
      gap: 3,
      lineHeight: 1,
      borderWidth: 2,
    },
  },

  cards: {
    primary: {
      bg: 'background',
      color: 'text',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      p: 3,
      gap: 2.5,
      border: '1px solid rgba(0, 0, 0, 0.125)',
      transition: `350ms ${easeIn('quad')}`,
      transitionProperty: 'border,box-shadow,opacity',
      ':hover': {
        border: '1px solid rgba(0, 0, 0, 0.25)',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      },
    },
  },

  forms: {
    input: {
      px: 2,
      py: 0.5,
      borderColor: 'text',
      transition: 'box-shadow 150ms ease-in',
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

  spinners: {
    default: {
      color: 'currentColor',
      fill: 'ghost',
      speed: 'real',
      size: '3xl',
      p: 0,
    },
    sm: {
      fontSize: 'sm',
    },
    md: {
      fontSize: 'md',
    },
    lg: {
      fontSize: 'lg',
    },
  },

  styles: {
    root: {
      p: 0,
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      ...heading,
      fontSize: 6,
      my: 4,
    },
    h2: {
      ...heading,
      fontSize: 5,
      my: 3,
      width: '100%',
    },
    h3: {
      ...heading,
      my: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
      my: 3,
    },
    h5: {
      ...heading,
      fontSize: 1,
      my: 2,
    },
    h6: {
      ...heading,
      fontSize: 0,
      my: 2,
    },
    a: {
      color: 'primary',
      transition: 'all 0.3s ease-in-out',
    },
    pre: {
      variant: 'prism',
      fontFamily: 'monospace',
      overflowX: 'auto',
      bg: 'muted',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontSize: 'inherit',
      color: 'accent',
    },
    inlineCode: {
      fontFamily: 'monospace',
      color: 'secondary',
      bg: 'muted',
    },
    blockquote: {
      borderLeft: '4px solid',
      borderColor: 'shadow',
      pl: 4,
      m: 0,
    },
    hr: {
      textAlign: 'center',
      overflow: 'visible',
      border: 'none',
      height: 0,
      ':before': {
        content: '"..."',
        display: 'inline-block',
        marginLeft: '.6em',
        color: 'mutedText',
        position: 'relative',
        top: '-36px',
        letterSpacing: '.6em',
        fontSize: 5,
      },
    },
    img: {
      maxWidth: '100%',
    },
    p: {
      fontSize: 3,
      my: 3,
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    summary: {
      fontSize: 3,
      my: 3,
      cursor: 'pointer',
    },
    ol: {
      fontSize: 3,
    },
    ul: {
      fontSize: 3,
      py: 2,
    },
    table: {
      margin: 0,
      borderCollapse: 'collapse',
      fontSize: '14px',
      lineHeight: '20px',
      textAlign: 'left',
      width: '100%',
      borderSpacing: 0,
      p: {
        m: 0,
      },
      pre: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: '240px',
        bg: 'inherit',
        mt: 2,
        mb: 0,
      },
      a: {
        wordBreak: 'break-word',
      },
    },
    th: {
      border: 'none',
      py: 3,
      pr: 2,
      pl: 3,
    },
    tbody: {
      'tr:last-of-type': {
        borderBottom: 0,
      },
    },
    thead: {
      borderBottom: (t: Theme): string => ` 2px solid  ${t.colors?.shadow}`,
      backgroundColor: 'background',
      color: 'text',
    },
    td: {
      py: 2,
      px: 3,
      borderBottom: 0,
    },
    tdgroup: {
      lineHeight: '24px',
      bg: 'gray',
      whiteSpace: 'nowrap',
      py: 3,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      flexDirection: 'row',
      alignItems: 'center',
    },
    tr: {
      borderBottom: (t: Theme): string => ` 1px solid  ${t.colors?.shadow}`,
    },
  },

  tags: {
    default: {
      cursor: 'default',
      lineHeight: 1,
    },
  },

  corners: {
    sharp: { borderRadius: 0 },
    dull: { borderRadius: 'sm' },
    round: { borderRadius: 'md' },
    ball: { borderRadius: 'lg' },
    pill: { borderRadius: 'max' },
  },

  density: {
    packed: { p: 0 },
    snug: { px: 1, py: 1 },
    gapped: { px: 2, py: 1 },
    airy: { px: 3, py: 2 },
  },

  energy: {
    rigid: {
      transition: 'none',
    },
    live: {
      transition: `150ms ${easeIn('sine')}`,
      transitionProperty: 'background,color,transform',
    },
  },

  mimic: {
    static: () => ({
      '&:hover': {},
    }),
    tint: () => ({}),
    invert: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme,
      '&:hover': {
        bg: colorScheme,
        color: 'background',
      },
    }),
    morph: () => ({
      transform: 'scale(1)',
      '&:hover': {
        transform: 'scale(1.2)',
      },
    }),
  },

  fill: {
    solid: ({ colorScheme, color, readable }) => ({
      bg: color,
      color: readableColor(color, 'white', 'black'),
      '&:hover': {
        bg: `${colorScheme}-700`,
        color: readableColor(color, 'white', 'black', true),
      },
    }),
    semi: ({ color, colorScheme }) => ({
      bg: `${colorScheme}-200`,
      color: colorScheme,
      border: '1px solid',
      borderColor: colorScheme,
      '&:hover': {
        bg: `${colorScheme}-300`,
        color: readableColor(color, 'white', 'black', true),
      },
    }),
    outline: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme,
      border: '1px solid',
      borderColor: colorScheme,
      '&:hover': {
        bg: `${colorScheme}-100`,
      },
    }),
    ghost: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme,
      '&:hover': {
        bg: `${colorScheme}-100`,
      },
    }),
    link: ({ colorScheme }) => ({
      color: colorScheme,
      bg: 'transparent',
      textDecoration: 'underline',
      '&:hover': {
        color: `${colorScheme}-700`,
      },
    }),
  },

  size: {
    xs: { fontSize: 'xs' },
    sm: { fontSize: 'sm' },
    md: { fontSize: 'md' },
    lg: { fontSize: 'lg' },
    xl: { fontSize: 'xl' },
    '2xl': { fontSize: '2xl' },
    '3xl': { fontSize: '3xl' },
  },

  weight: {
    bold: { fontWeight: 'bold' },
    regular: { fontWeight: 'body' },
    thin: { fontWeight: 'thin' },
  },
};
