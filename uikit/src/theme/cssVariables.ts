import { Theme } from './types/theme';

export function toCssVars(theme: Theme): [string, string | number][] {
  const colors = Object.entries(theme.colors ?? {})
    .filter(([name, value]) => !!value || typeof value !== 'string')
    .map(([name, scale]) => [`--clr-${name}`, `var(--theme-ui-colors-${name})`]);

  const fonts = Object.entries(theme.fonts).map(([variant, family]) => [
    `--font-${variant}`,
    family,
  ]);

  const fontSizes = Object.entries(theme.fontSizes).map(([size, dim]) => [
    `--font-size-${size}`,
    dim.toString(),
  ]);

  const fontWeights = Object.entries(theme.fontWeights).map(([variant, weight]) => [
    `--font-weight-${variant}`,
    weight,
  ]);

  const letterSpacings = Object.entries(theme.letterSpacings).map(([variant, size]) => [
    `--letter-spacing-${variant}`,
    size,
  ]);

  const radii = Object.entries(theme.radii).map(([variant, radius]) => [
    `--radius-${variant}`,
    radius,
  ]);

  const shadows = Object.entries(theme.shadows).map(([key, val]) => [`--shadow-${key}`, val]);

  const sizes = Object.entries(theme.sizes).map(([size, dim]) => [`--size-${size}`, dim]);

  const spaces = Object.entries(theme.spaces).map(([space, dim]) => [`--space-${space}`, dim]);

  const transitionProps = Object.entries(theme.transition.properties).map(([key, val]) => [
    `--tr-props-${key}`,
    val,
  ]);

  const transitionDurations = Object.entries(theme.transition.durations).map(([key, val]) => [
    `--tr-duration-${key}`,
    val,
  ]);

  const transitionEasings = Object.entries(theme.transition.easings).map(([key, val]) => [
    `--tr-easing-${key}`,
    val,
  ]);

  const zIndices = Object.entries(theme.zIndices).map(([variant, zIndex]) => [
    `--z-${variant}`,
    zIndex,
  ]);

  return [
    ...colors,
    ...fonts,
    ...fontSizes,
    ...fontWeights,
    ...letterSpacings,
    ...radii,
    ...shadows,
    ...sizes,
    ...spaces,
    ...transitionDurations,
    ...transitionEasings,
    ...transitionProps,
    ...zIndices,
  ];
}

export function toCssVarsString(cssVars: string[][]) {
  return cssVars.map((kv) => kv.join(':')).join(';');
}

const applyCssVariables = (theme: Theme) => {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  const cssVars = toCssVarsString(toCssVars(theme));
  styleElement.innerHTML = `:host, :root { ${cssVars} }`;
  document.head.appendChild(styleElement);
  return () => {
    document.head.removeChild(styleElement);
  };
};

export default applyCssVariables;
