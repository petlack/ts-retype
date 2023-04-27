import { Dim, Duration, Easing, Font, FontSize, FontWeight, Shadow, ZVal } from './atom';
import { Size } from './size';
import { Space } from './space';

export type Color = string | number | ColorScale;

export type ColorScale = {
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

type Any<T> = { [name: string | number]: T };

export type Theme = {
  name: string;

  blur: {
    none: Dim;
    sm: Dim;
    base: Dim;
    md: Dim;
    lg: Dim;
    xl: Dim;
    '2xl': Dim;
    '3xl': Dim;
  } & Any<Dim>;

  colors: {
    white: Color;
    black: Color;
    accent: Color;
    transparent: Color;
    current: Color;
  } & Any<Color>;

  fonts: {
    heading: Font;
    body: Font;
    mono: Font;
  } & Any<Font>;

  fontSizes: {
    '3xs': Dim;
    '2xs': Dim;
    xs: Dim;
    sm: Dim;
    md: Dim;
    lg: Dim;
    xl: Dim;
    '2xl': Dim;
    '3xl': Dim;
  } & Any<FontSize>;

  fontWeights: {
    hairline: FontWeight;
    thin: FontWeight;
    light: FontWeight;
    normal: FontWeight;
    medium: FontWeight;
    semibold: FontWeight;
    bold: FontWeight;
    extrabold: FontWeight;
    black: FontWeight;
  } & Any<FontWeight>;

  letterSpacings: {
    tighter: Dim;
    tight: Dim;
    normal: Dim;
    wide: Dim;
    wider: Dim;
    widest: Dim;
  } & Any<Dim>;

  radii: {
    none: Dim;
    sm: Dim;
    base: Dim;
    md: Dim;
    lg: Dim;
    xl: Dim;
    '2xl': Dim;
    '3xl': Dim;
    full: Dim;
  } & Any<Dim>;

  shadows: {
    xs: Shadow;
    sm: Shadow;
    base: Shadow;
    md: Shadow;
    lg: Shadow;
    xl: Shadow;
    '2xl': Shadow;
    outline: Shadow;
    inner: Shadow;
    none: Shadow;
    'dark-lg': Shadow;
  } & Any<Shadow>;

  sizes: Size & Any<Dim>;

  spaces: Space & Any<Dim>;

  transition: {
    properties: {
      common: string;
      colors: string;
      dimensions: string;
      position: string;
      background: string;
    } & Any<string>;

    durations: {
      'ultra-fast': Duration;
      faster: Duration;
      fast: Duration;
      normal: Duration;
      slow: Duration;
      slower: Duration;
      'ultra-slow': Duration;
    } & Any<Duration>;

    easings: {
      'ease-in': Easing;
      'ease-out': Easing;
      'ease-in-out': Easing;
    } & Any<Easing>;
  };

  zIndices: {
    // fixed: ZVal;
    // always: ZVal;
    // prefer: ZVal;
    // above: ZVal;
    // normal: ZVal;
    // below: ZVal;
    // never: ZVal;

    hide: ZVal;
    auto: ZVal;
    base: ZVal;
    docked: ZVal;
    dropdown: ZVal;
    sticky: ZVal;
    banner: ZVal;
    overlay: ZVal;
    modal: ZVal;
    popover: ZVal;
    skipLink: ZVal;
    toast: ZVal;
    tooltip: ZVal;
  } & Any<ZVal>;
};
