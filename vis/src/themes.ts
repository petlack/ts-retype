import { Theme } from '@ts-retype/uikit';
export const themes = {
  light: {
    name: 'light',
    blur: {
      none: 0,
      sm: '4px',
      base: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px',
    },
    colors: {
      black: '#060c0e',
      white: '#fafcfd',
      accent: {
        '25': '#edf3f7',
        '50': '#dfeaf0',
        '100': '#d2e1ea',
        '200': '#a9c6d6',
        '300': '#80abc3',
        '400': '#5392b1',
        '500': '#0a799e',
        '600': '#146887',
        '700': '#185871',
        '800': '#19485c',
        '900': '#173847',
        '950': '#152a33',
        '975': '#111c21',
      },
      transparent: 'transparent',
      current: 'currentColor',
      bg: '#f8fafc',
      fg: '#0d1418',
      neutral: {
        '25': '#f4f7f8',
        '50': '#edf1f2',
        '100': '#e7eced',
        '200': '#d5dbde',
        '300': '#c3cbcf',
        '400': '#b1bcc0',
        '500': '#a0acb1',
        '600': '#889397',
        '700': '#717a7e',
        '800': '#5a6265',
        '900': '#454b4e',
        '950': '#303638',
        '975': '#1d2123',
      },
      second: {
        '25': '#f7f2ee',
        '50': '#f5eadf',
        '100': '#f3e2d1',
        '200': '#ebcaa6',
        '300': '#e1b37d',
        '400': '#d59d53',
        '500': '#c68726',
        '600': '#a97526',
        '700': '#8e6326',
        '800': '#735224',
        '900': '#594122',
        '950': '#40321f',
        '975': '#27221c',
      },
    },
    fonts: {
      body: "'Noto Sans', sans-serif",
      heading: "'Exo 2', sans-serif",
      mono: "'Fira Code', monospace",
    },
    fontSizes: {
      '3xs': '0.45rem',
      '2xs': '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadows: {
      xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1),0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      none: 'none',
      'dark-lg':
        'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,rgba(0, 0, 0, 0.2) 0px 5px 10px,rgba(0, 0, 0, 0.4) 0px 15px 40px',
    },
    sizes: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
      px: '1px',
      '0-5': '0.125rem',
      '1-5': '0.375rem',
      '2-5': '0.625rem',
      '3-5': '0.875rem',
      max: 'max-content',
      min: 'min-content',
      full: '100%',
      '3xs': '14rem',
      '2xs': '16rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      '8xl': '90rem',
      prose: '60ch',
      'container-sm': '640px',
      'container-md': '768px',
      'container-lg': '1024px',
      'container-xl': '1280px',
    },
    spaces: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
      px: '1px',
      '0-5': '0.125rem',
      '1-5': '0.375rem',
      '2-5': '0.625rem',
      '3-5': '0.875rem',
    },
    transition: {
      properties: {
        common: 'background-color,border-color,color,fill,stroke,opacity,box-shadow,transform',
        colors: 'background-color,border-color,color,fill,stroke',
        dimensions: 'width,height',
        position: 'left,right,top,bottom',
        background: 'background-color,background-image,background-position',
      },
      durations: {
        'ultra-fast': '50ms',
        faster: '100ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '400ms',
        'ultra-slow': '500ms',
      },
      easings: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    zIndices: {
      hide: '-1',
      auto: 'auto',
      base: '0',
      docked: '10',
      dropdown: '1000',
      sticky: '1100',
      banner: '1200',
      overlay: '1300',
      modal: '1400',
      popover: '1500',
      skipLink: '1600',
      toast: '1700',
      tooltip: '1800',
    },
  },
  dark: {
    name: 'dark',
    blur: {
      none: 0,
      sm: '4px',
      base: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px',
    },
    colors: {
      black: '#fafcfd',
      white: '#060c0e',
      accent: {
        '25': '#0d1418',
        '50': '#111b20',
        '100': '#132128',
        '200': '#173543',
        '300': '#194b60',
        '400': '#16617e',
        '500': '#0a799e',
        '600': '#458bab',
        '700': '#679db9',
        '800': '#86afc6',
        '900': '#a3c2d4',
        '950': '#c0d5e1',
        '975': '#dde8ef',
      },
      transparent: 'transparent',
      current: 'currentColor',
      bg: '#0d1418',
      fg: '#f8fafc',
      neutral: {
        '25': '#131718',
        '50': '#1b2022',
        '100': '#24292b',
        '200': '#40474a',
        '300': '#5f676a',
        '400': '#7f898d',
        '500': '#a0acb1',
        '600': '#acb7bc',
        '700': '#b9c2c6',
        '800': '#c6ced1',
        '900': '#d3d9dc',
        '950': '#e0e5e7',
        '975': '#edf0f2',
      },
      second: {
        '25': '#1a1b1a',
        '50': '#26211b',
        '100': '#31281d',
        '200': '#543e22',
        '300': '#785525',
        '400': '#9e6e26',
        '500': '#c68726',
        '600': '#d19747',
        '700': '#daa665',
        '800': '#e3b783',
        '900': '#eac7a0',
        '950': '#f0d8be',
        '975': '#f5e9dd',
      },
    },
    fonts: {
      body: "'Noto Sans', sans-serif",
      heading: "'Exo 2', sans-serif",
      mono: "'Fira Code', monospace",
    },
    fontSizes: {
      '3xs': '0.45rem',
      '2xs': '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadows: {
      xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1),0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      none: 'none',
      'dark-lg':
        'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,rgba(0, 0, 0, 0.2) 0px 5px 10px,rgba(0, 0, 0, 0.4) 0px 15px 40px',
    },
    sizes: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
      px: '1px',
      '0-5': '0.125rem',
      '1-5': '0.375rem',
      '2-5': '0.625rem',
      '3-5': '0.875rem',
      max: 'max-content',
      min: 'min-content',
      full: '100%',
      '3xs': '14rem',
      '2xs': '16rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      '8xl': '90rem',
      prose: '60ch',
      'container-sm': '640px',
      'container-md': '768px',
      'container-lg': '1024px',
      'container-xl': '1280px',
    },
    spaces: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
      px: '1px',
      '0-5': '0.125rem',
      '1-5': '0.375rem',
      '2-5': '0.625rem',
      '3-5': '0.875rem',
    },
    transition: {
      properties: {
        common: 'background-color,border-color,color,fill,stroke,opacity,box-shadow,transform',
        colors: 'background-color,border-color,color,fill,stroke',
        dimensions: 'width,height',
        position: 'left,right,top,bottom',
        background: 'background-color,background-image,background-position',
      },
      durations: {
        'ultra-fast': '50ms',
        faster: '100ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '400ms',
        'ultra-slow': '500ms',
      },
      easings: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    zIndices: {
      hide: '-1',
      auto: 'auto',
      base: '0',
      docked: '10',
      dropdown: '1000',
      sticky: '1100',
      banner: '1200',
      overlay: '1300',
      modal: '1400',
      popover: '1500',
      skipLink: '1600',
      toast: '1700',
      tooltip: '1800',
    },
  },
} as { light: Theme; dark: Theme };
