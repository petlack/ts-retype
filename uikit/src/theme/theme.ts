import { Theme, ThemeUIStyleObject } from 'theme-ui';

const text =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

const heading = {
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
};

export type Corners = 'sharp' | 'dull' | 'round' | 'ball' | 'pill';
export type Density = 'airy' | 'dense';
export type Fill = 'solid' | 'semi' | 'outline';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type Weight = 'thin' | 'regular' | 'bold';

export type TermixTheme = Theme &
  Partial<{
    tags: Record<string, ThemeUIStyleObject>;
    corners: Record<Corners, ThemeUIStyleObject>;
    density: Record<Density, ThemeUIStyleObject>;
    fill: Record<Fill, (props: { color: string }) => ThemeUIStyleObject>;
    size: Record<Size, ThemeUIStyleObject>;
    weight: Record<Weight, ThemeUIStyleObject>;
  }>;

export const theme: TermixTheme = {
  useCustomProperties: false,
  colors: {
    text: '#454f5b',
    background: '#ffffff',
    primary: '#5c6ac4',
    secondary: '#006fbb',
    muted: '#e6e6e6',
    mutedText: '#69768C',
    accent: '#f49342',
    darken: '#00044c',
    gray: '#f6f6f6',
    highlight: '#d9f2f1',
    action: '#3B817D',
    selected: '#027AC5',
    shadow: 'rgba(0, 0, 0, 0.1)',

    modes: {
      dark: {
        primary: '#efefef',
        secondary: '#b4e1fa',
        highlight: '#b7ecec',
        muted: '#262626',
        mutedText: '#c9cacf',
        gray: '#4d5866',
        background: '#38404a',
        text: '#d3d4db',
        selected: '#b3d9ff',
        action: '#d9f2f1',
        shadow: 'rgba(211, 212, 219, 0.1)',
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
    heading: 600,
    bold: 700,
  },

  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  buttons: {
    plain: {
      p: 0,
      backgroundColor: 'transparent',
      color: 'primary',
    },
  },

  cards: {
    primary: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: 2,
      border: '1px solid rgba(0, 0, 0, 0.125)',
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
      borderBottom: (t: Theme): string => `4px solid ${t.colors?.text}`,
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
      borderLeft: (t: Theme): string => `4px solid ${t.colors?.shadow}`,
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

  tags: {},

  corners: {
    sharp: { borderRadius: 0 },
    dull: { borderRadius: 'sm' },
    round: { borderRadius: 'md' },
    ball: { borderRadius: 'lg' },
    pill: { borderRadius: 'max' },
  },

  density: {
    dense: {},
    airy: {},
  },

  fill: {
    solid: ({ color }) => ({ backgroundColor: color, color: 'white' }),
    semi: ({ color }) => ({
      backgroundColor: `${color}-200`,
      color,
      border: '1px solid',
      borderColor: color,
    }),
    outline: ({ color }) => ({
      backgroundColor: 'transparent',
      color,
      border: '1px solid',
      borderColor: color,
    }),
  },

  size: {
    xs: { fontSize: 'xs' },
    sm: { fontSize: 'sm' },
    md: { fontSize: 'md' },
    lg: { fontSize: 'lg' },
  },

  weight: {
    bold: { fontWeight: 'bold' },
    regular: { fontWeight: 'body' },
    thin: { fontWeight: 'thin' },
  },
};

// export const useTheme = (): Theme => {
//   const { theme: currentTheme } = useThemeUI();
//   return currentTheme || theme;
// };

const paletteColorCount = 6;

export const getPaletteColor = (index: number): string =>
  (theme.colors as Record<string, string>)[`palette${index % paletteColorCount}`];

export const getAccentPaletteColor = (index: number): string =>
  (theme.colors as Record<string, string>)[`accentPalette${index % paletteColorCount}`];
