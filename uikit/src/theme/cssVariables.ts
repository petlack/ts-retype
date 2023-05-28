import { Theme } from './types/theme';

type CssEntry = [string, string | number];

export function toCssVars(theme: Theme): CssEntry[] {
  const colors = Object.entries(theme.colors ?? {})
    .filter(([, value]) => !!value || typeof value !== 'string')
    .map(([name]) => [`--clr-${name}`, `var(--theme-ui-colors-${name})`] as CssEntry);

  const fonts = Object.entries(theme.fonts).map(
    ([variant, family]) => [`--font-${variant}`, family] as CssEntry,
  );

  const fontSizes = Object.entries(theme.fontSizes).map(
    ([size, dim]) => [`--font-size-${size}`, dim.toString()] as CssEntry,
  );

  const fontWeights = Object.entries(theme.fontWeights).map(
    ([variant, weight]) => [`--font-weight-${variant}`, weight] as CssEntry,
  );

  const letterSpacings = Object.entries(theme.letterSpacings).map(
    ([variant, size]) => [`--letter-spacing-${variant}`, size] as CssEntry,
  );

  const radii = Object.entries(theme.radii).map(
    ([variant, radius]) => [`--radius-${variant}`, radius] as CssEntry,
  );

  const shadows = Object.entries(theme.shadows).map(
    ([key, val]) => [`--shadow-${key}`, val] as CssEntry,
  );

  const sizes = Object.entries(theme.sizes).map(
    ([size, dim]) => [`--size-${size}`, dim] as CssEntry,
  );

  const spaces = Object.entries(theme.spaces).map(
    ([space, dim]) => [`--space-${space}`, dim] as CssEntry,
  );

  const transitionProps = Object.entries(theme.transition.properties).map(
    ([key, val]) => [`--tr-props-${key}`, val] as CssEntry,
  );

  const transitionDurations = Object.entries(theme.transition.durations).map(
    ([key, val]) => [`--tr-duration-${key}`, val] as CssEntry,
  );

  const transitionEasings = Object.entries(theme.transition.easings).map(
    ([key, val]) => [`--tr-easing-${key}`, val] as CssEntry,
  );

  const zIndices = Object.entries(theme.zIndices).map(
    ([variant, zIndex]) => [`--z-${variant}`, zIndex] as CssEntry,
  );

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

export function toCssVarsString(cssVars: CssEntry[]) {
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
