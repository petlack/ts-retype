import { readableColor, darken, easeIn, lighten, transparentize } from 'polished';
import { Theme } from 'theme-ui';
import { Termix } from './types';

// const text =
//   'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

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
    // secondary: '#006fbb',
    // muted: '#e6e6e6',
    // mutedText: '#69768C',
    // accent: '#f49342',
    // darken: '#00044c',
    // gray: '#f6f6f6',
    // highlight: '#d9f2f1',
    // action: '#3B817D',
    // selected: '#027AC5',
    // shadow: 'rgba(0, 0, 0, 0.1)',

    modes: {
      dark: {
        text: 'white',
        background: 'black',
        primary: 'hotpink',
        //     highlight: '#b7ecec',
        //     muted: '#262626',
        //     mutedText: '#c9cacf',
        //     gray: '#4d5866',
        //     background: '#38404a',
        //     text: '#d3d4db',
        //     selected: '#b3d9ff',
        //     action: '#d9f2f1',
        //     shadow: 'rgba(211, 212, 219, 0.1)',
      },
    },
  },

  fonts: {
    body: 'text',
    heading: 'medium-content-title-font,Georgia,Cambria,"Times New Roman",Times,serif',
    monospace: 'Menlo, monospace',
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

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  speeds: {
    slow: '4s',
    real: '1.5s',
    fast: '1s',
  },

  buttons: {
    primary: {
      cursor: 'pointer',
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

  cards: {
    primary: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: 2,
      border: '1px solid rgba(0, 0, 0, 0.125)',
      transitionProperty: 'border,box-shadow',
      transition: `350ms ${easeIn('quad')}`,
      ':hover': {
        border: '1px solid rgba(0, 0, 0, 0.25)',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      },
    },
  },

  radii: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    max: '100vw',
  },

  styles: {
    root: {
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
      transitionProperty: 'background,color',
      transition: `150ms ${easeIn('sine')}`,
    },
  },

  mimic: {
    static: () => ({
      '&:hover': {},
    }),
    tint: () => ({}),
    morph: () => ({
      '&:hover': {},
    }),
  },

  fill: {
    solid: ({ color }) => ({
      bg: color,
      color: readableColor(color, 'white', 'black'),
      '&:hover': {
        bg: darken(0.1, color),
        color: readableColor(darken(0.1, color), 'white', 'black', true),
      },
    }),
    semi: ({ color }) => ({
      bg: lighten(0.4, color),
      color,
      border: '1px solid',
      borderColor: color,
      '&:hover': {
        bg: lighten(0.3, color),
        color: readableColor(lighten(0.3, color), 'white', 'black', true),
      },
    }),
    outline: ({ color }) => ({
      bg: 'transparent',
      color,
      border: '1px solid',
      borderColor: color,
      '&:hover': {
        bg: transparentize(0.9, color),
      },
    }),
    ghost: ({ color }) => ({
      bg: 'transparent',
      color,
      '&:hover': {
        bg: transparentize(0.9, color),
      },
    }),
    link: ({ color }) => ({
      color,
      bg: 'transparent',
      textDecoration: 'underline',
      '&:hover': {
        color: darken(0.2, color),
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
