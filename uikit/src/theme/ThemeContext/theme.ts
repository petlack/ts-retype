import { Theme, ThemeUIStyleObject, useThemeUI } from 'theme-ui';

const text =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

const heading = {
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
};

export type ControlsTheme = {
  tags: Record<string, ThemeUIStyleObject>;
} & Theme;

export const theme: ControlsTheme = {
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

  fontSizes: [12, 14, 16, 20, 24, 32, 42, 48, 64, 96],

  fontWeights: {
    thin: 300,
    body: 200,
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
      lineHeight: 'normal',
      backgroundColor: 'transparent',
      color: 'primary',
    },
    primary: {
      color: '#333',
      backgroundColor: '#f3f3f3',
      borderRadius: '5px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset',
      ':disabled': {
        color: '#aaa',
      },
    },
    secondary: {
      backgroundColor: 'action',
    },
  },

  cards: {
    primary: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: 2,
      borderRadius: 8,
      border: '1px solid rgba(0, 0, 0, 0.125)',
      ':hover': {
        border: '1px solid rgba(0, 0, 0, 0.25)',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      },
    },
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

  tags: {
    default: {
      display: 'inline-block',
      px: 1,
      borderRadius: 5,
      whiteSpace: 'nowrap',
    },
  },
};

export const useTheme = (): Theme => {
  const { theme: currentTheme } = useThemeUI();
  return currentTheme || theme;
};

const paletteColorCount = 6;

export const getPaletteColor = (index: number): string =>
  (theme.colors as Record<string, string>)[`palette${index % paletteColorCount}`];

export const getAccentPaletteColor = (index: number): string =>
  (theme.colors as Record<string, string>)[`accentPalette${index % paletteColorCount}`];
