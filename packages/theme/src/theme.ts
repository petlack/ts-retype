type Any<T> = { [name: string | number]: T };

export type ThemeMode = 'light' | 'dark';

export type Color = string | number | ColorScale;

export type ColorScale = {
  25: Color;
  50: Color;
  100: Color;
  200: Color;
  300: Color;
  400: Color;
  500: Color;
  600: Color;
  700: Color;
  800: Color;
  900: Color;
  950: Color;
  975: Color;
};

export type AccentColors = {
  accent: Color;
  'accent-emphasis': Color;
  'accent-static': Color;
  'accent-muted': Color;
  'accent-subtle': Color;
};

export type ComplementaryColors = {
  comp: Color;
  'comp-emphasis': Color;
  'comp-static': Color;
  'comp-muted': Color;
  'comp-subtle': Color;
};

export type ForegroundColors = {
  fg: Color;
  'fg-emphasis': Color;
  'fg-muted': Color;
  'fg-subtle': Color;
  'fg-on-accent': Color;
};

export type BackgroundColors = {
  bg: Color;
  'bg-emphasis': Color;
  'bg-muted': Color;
  'bg-subtle': Color;
  'bg-on-accent': Color;
};

export type Theme = {
    white: Color;
    black: Color;
    accent: Color;
    transparent: Color;
    current: Color;
  } & Any<Color>;

export const Standard: Theme = {
    black: '#000',
    white: '#fff',
    accent: '#f00',
    transparent: 'transparent',
    current: 'currentColor',
};
