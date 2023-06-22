import { easeIn } from 'polished';
import { getColor } from '@theme-ui/color';
import { ComponentPropsWithRef, ElementType } from 'react';
import { Assign } from '../components/types';
import { BoxOwnProps as UiBoxOwnProps } from 'theme-ui';
import { Corners, Density, Energy, Fill, Mimic, Size, Speed, TermixStyle, Weight } from './types';
import { Theme } from 'theme-ui';
import { readableColor } from './mixer';

export type Sx = TermixStyle;

export type Tx = Partial<{
  colorScheme: string | 'default';
  corners: Corners | 'default';
  density: Density | 'default';
  energy: Energy | 'default';
  fill: Fill | 'default';
  mimic: Mimic | 'default';
  sizing: Size | 'default';
  speed: Speed | 'default';
  weight: Weight | 'default';
  variant?: string | 'default';
}>;

export type TermixProps = {
  sx?: Sx;
  tx?: Tx;
  element?: keyof ComponentsDef;
};

export type Mix<T extends ElementType<any>, OwnProps = Record<string, any>> = Omit<
  Assign<ComponentPropsWithRef<T>, OwnProps & TermixProps & UiBoxOwnProps>,
  'ref'
>;

type TermixComponentDefinition = {
  default?: TermixProps;
  overrides?: Partial<TermixDef>;
  variants?: { [k: string]: TermixProps };
};

type ConfigureStyleFn = (props: { tx: Tx; theme: Theme }) => Sx;

export type TermixDef = {
  corners: Record<Corners | 'default', Sx>;
  density: Record<Density | 'default', Sx | ConfigureStyleFn>;
  energy: Record<Energy | 'default', Sx | ConfigureStyleFn>;
  fill: Partial<Record<Fill | 'default', ConfigureStyleFn>>;
  mimic: Record<Mimic | 'default', ConfigureStyleFn>;
  sizing: Record<Size | 'default', Sx>;
  speed: Record<Speed | 'default', Sx>;
  weight: Record<Weight | 'default', Sx>;
};

export type ComponentsDef = Partial<{
  button: TermixComponentDefinition;
  card: TermixComponentDefinition;
  input: TermixComponentDefinition;
  options: TermixComponentDefinition;
  spinner: TermixComponentDefinition;
  tag: TermixComponentDefinition;
}>;

export const termixDef: TermixDef = {
  corners: {
    default: { borderRadius: 0 },
    sharp: { borderRadius: 0 },
    dull: { borderRadius: 'sm' },
    round: { borderRadius: 'md' },
    ball: { borderRadius: 'lg' },
    pill: { borderRadius: 'max' },
  },

  density: {
    default: { px: 0, py: 0, gap: 0 },
    airy: { px: 3, py: 2, gap: 2 },
    gapped: { px: 2, py: 1, gap: 1 },
    packed: { px: 0, py: 0, gap: 0 },
    snug: { px: 1, py: 0.5, gap: 0.5 },
  },

  energy: {
    default: { transition: 'none' },
    rigid: { transition: 'none' },
    live: {
      transition: `150ms ${easeIn('sine')}`,
      transitionProperty: 'background,color,transform',
    },
  },

  fill: {
    default: () => ({
      color: 'text',
    }),
    solid: ({ tx: { colorScheme }, theme }) => ({
      bg: colorScheme,
      color: readableColor(getColor(theme, colorScheme)),
      borderColor: colorScheme,
      '--_clr-hover-bg': getColor(theme, `${colorScheme}-700`),
      '--_clr-hover-color': readableColor(getColor(theme, `${colorScheme}-700`)),
    }),
    semi: ({ theme, tx: { colorScheme } }) => ({
      bg: `${colorScheme}-200`,
      color: `${colorScheme}-800`,
      borderColor: colorScheme,
      '--_clr-hover-bg': getColor(theme, `${colorScheme}-300`),
      '--_clr-hover-color': getColor(theme, `${colorScheme}-900`),
    }),
    ghost: ({ theme, tx: { colorScheme } }) => ({
      bg: 'unset',
      color: colorScheme,
      borderColor: undefined,
      '--_clr-hover-bg': getColor(theme, `${colorScheme}-200`),
      '--_clr-hover-color': getColor(theme, `${colorScheme}-700`),
    }),
    outline: ({ theme, tx: { colorScheme } }) => ({
      bg: 'unset',
      color: colorScheme,
      borderColor: colorScheme,
      border: '1px solid',
      '--_clr-hover-bg': getColor(theme, `${colorScheme}-100`),
      '--_clr-hover-color': getColor(theme, `${colorScheme}-700`),
    }),
    link: ({ theme, tx: { colorScheme } }) => ({
      bg: 'unset',
      color: colorScheme,
      borderColor: colorScheme,
      textDecoration: 'underline',
      '--_clr-hover-color': getColor(theme, `${colorScheme}-800`),
    }),
  },

  mimic: {
    default: () => ({}),
    static: () => ({
      '&:hover': {},
    }),
    tint: () => ({
      '&:hover': {
        bg: 'var(--_clr-hover-bg)',
        color: 'var(--_clr-hover-color)',
      },
    }),
    invert: ({ theme, tx: { colorScheme } }) => ({
      bg: 'transparent',
      color: colorScheme,
      '&:hover': {
        color: readableColor(getColor(theme, `${colorScheme}`)),
        bg: getColor(theme, `${colorScheme}`),
      },
    }),
    morph: () => ({
      transform: 'scale(1)',
      '&:hover': {
        transform: 'scale(1.2)',
      },
    }),
  },

  sizing: {
    default: { fontSize: 'md' },
    xs: { fontSize: 'xs' },
    sm: { fontSize: 'sm' },
    md: { fontSize: 'md' },
    lg: { fontSize: 'lg' },
    xl: { fontSize: 'xl' },
    '2xl': { fontSize: '2xl' },
    '3xl': { fontSize: '3xl' },
  },

  speed: {
    default: { transitionDuration: '150ms' },
    slow: { transitionDuration: '4s' },
    real: { transitionDuration: '1s' },
    fast: { transitionDuration: '150ms' },
  },

  weight: {
    default: { fontWeight: 'body' },
    bold: { fontWeight: 'bold' },
    regular: { fontWeight: 'body' },
    thin: { fontWeight: 'thin' },
  },
};

export const cx: ComponentsDef = {
  button: {
    overrides: {
      sizing: {
        default: {},
        xs: { px: 1, py: 0, borderRadius: 'sm' },
        sm: { px: 2, py: 0.5, borderRadius: 'sm' },
        md: { px: 3, py: 1, gap: 2, borderRadius: 'md' },
        lg: { px: 3, py: 1.5, gap: 3, borderRadius: 'md' },
        xl: { fontSize: 'lg', px: 3, py: 1.5, gap: 3, borderRadius: 'md' },
        '2xl': { fontSize: 'xl', px: 4, py: 2, gap: 3, borderRadius: 'md' },
        '3xl': { fontSize: 'xl', px: 4, py: 2, gap: 4, borderRadius: 'lg' },
      },
    },
    default: {
      tx: {
        colorScheme: 'primary',
        fill: 'solid',
        sizing: 'md',
        density: 'gapped',
        weight: 'bold',
        corners: 'dull',
        energy: 'live',
        mimic: 'tint',
      },
      sx: {
        cursor: 'pointer',
        fontFamily: 'body',
        '&>svg': {
          width: '1em',
          height: '1em',
        },
      },
    },
    variants: {
      disabled: {
        sx: {
          // colorScheme: 'overlay1',
          cursor: 'not-allowed',
        },
      },
    },
  },

  card: {
    default: {
      tx: {
        corners: 'round',
        density: 'airy',
      },
      sx: {
        bg: 'base',
        color: 'text',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        gap: 5,
        border: '1px solid rgba(0, 0, 0, 0.125)',
        transitionTimingFunction: `${easeIn('quad')}`,
        transitionDuration: 'short',
        transitionProperty: 'border,box-shadow,opacity',
        ':hover': {
          border: '1px solid rgba(0, 0, 0, 0.25)',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
        },
      },
    },
  },

  input: {
    overrides: {
      fill: {
        default: ({ theme, tx: { colorScheme } }) => ({
          color: 'text',
          borderColor: 'surface0',
          '--_clr-hover-color': getColor(theme, colorScheme),
        }),
        solid: ({ theme, tx: { colorScheme } }) => ({
          color: readableColor(getColor(theme, `${colorScheme}-700`)),
          bg: `${colorScheme}-700`,
          borderColor: `${colorScheme}-600`,
          '--_clr-outer-bg': `${colorScheme}-200`,
          '--_clr-outer-fg': `${colorScheme}-600`,
        }),
      },
      sizing: {
        default: {},
        xs: { borderRadius: 'xs' },
        sm: {},
        md: { px: 2, py: 1.5, fontSize: 'md' },
        lg: { px: 2, py: 1.5, fontSize: 'md' },
        xl: { px: 2, py: 1.5, fontSize: 'lg' },
        '2xl': { px: 3, py: 2, fontSize: 'lg', borderRadius: 'md' },
        '3xl': { px: 4, py: 3, fontSize: 'xl', borderRadius: 'lg' },
      },
    },

    default: {
      tx: {
        colorScheme: 'primary',
        density: 'snug',
        corners: 'dull',
        sizing: 'md',
      },
      sx: {
        lineHeight: 1,
        bg: 'unset',
        borderColor: 'text-100',
        borderWidth: 1,
        borderStyle: 'solid',
        transition: 'box-shadow 150ms ease-in',
        fontFamily: 'body',
        fontSize: 'md',
        '&:focus': {
          borderColor: 'var(--_clr-hover-color)',
          borderWidth: 1,
          boxShadow:
            'var(--_clr-hover-color) 0px 0px 5px -2px, var(--_clr-hover-color) 0px 0px 1px 0px',
          outline: 'none',
        },
        '&::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
        },
      },
    },

    variants: {
      radio: {
        tx: {
          density: 'gapped',
          corners: 'pill',
        },
        sx: {
          position: 'relative',
          cursor: 'pointer',
          aspectRatio: 1,
          width: '1em',
          flexShrink: 0,
          bg: 'none',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'surface0',
          transform: 'scale(1)',
          transition: '150ms ease-in',
          transitionProperty: 'transform,background,border-color',
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 1,
            borderRadius: '100vw',
            bg: 'primary',
            transform: 'scale(0)',
            transition: '150ms ease-in',
            transitionProperty: 'transform',
          },
          '&:hover, label:hover &': {
            borderColor: 'overlay2',
            bg: 'mantle',
            transform: 'scale(1.05)',
          },
          'input:checked ~ &': {
            '&:after': {
              transform: 'scale(1)',
            },
          },
          'input:checked ~ &:hover': {
            '&:after': {
              transform: 'scale(1.1)',
            },
          },
          'input:focus ~ &': {
            border: '2px solid',
            borderColor: 'primary',
          },
        },
      },
    },
  },

  spinner: {},

  tag: {
    overrides: {
      sizing: {
        default: {},
        xs: { px: 1, py: 0.5, borderRadius: 'xs' },
        sm: { px: 1, py: 0.5, borderRadius: 'sm' },
        md: { px: 1, py: 1, borderRadius: 'sm' },
        lg: { px: 1.5, py: 1.5, borderRadius: 'sm' },
        xl: { fontSize: 'lg', px: 2, py: 2, borderRadius: 'md' },
        '2xl': { fontSize: 'xl', px: 2, py: 2, borderRadius: 'md' },
        '3xl': { fontSize: '2xl', px: 2, py: 2, borderRadius: 'md' },
      },
    },

    default: {
      tx: {
        corners: 'dull',
        density: 'gapped',
        fill: 'semi',
        energy: 'rigid',
        mimic: 'static',
      },
      sx: {
        lineHeight: 1,
        display: 'inline-flex',
      },
    },
  },
};
