import { ColorMode, ColorModesScale, css, Theme } from '@theme-ui/css';

const toVarName = (key: string) => `--termix-${key.replace('-__default', '')}`;
const toVarValue = (key: string) => `var(${toVarName(key)})`;

const join = (...args: (string | undefined)[]) => args.filter(Boolean).join('-');

const reservedKeys = new Set([
  'useCustomProperties',
  'initialColorModeName',
  'printColorModeName',
  'initialColorMode',
  'useLocalStorage',
  'config',
]);

// convert theme values to custom properties
export const toCustomProperties = (obj: Record<string, any> | undefined, parent?: string) => {
  const next: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];
    const name = join(parent, key);
    if (value && typeof value === 'object') {
      next[key] = toCustomProperties(value, name);
      continue;
    }
    if (reservedKeys.has(key)) {
      next[key] = value;
      continue;
    }
    next[key] = toVarValue(name);
  }

  return next;
};

/**
 * @internal
 * Recursively transforms an object into CSS variables excluding "modes" key.
 */
export const __objectToVars = (parent: string, obj: Record<string, any>) => {
  let vars: Record<string, object> = {};
  for (const key in obj) {
    if (key === 'modes') continue;
    const name = join(parent, key);
    const value = obj[key];
    if (value && typeof value === 'object') {
      vars = {
        ...vars,
        ...__objectToVars(name, value),
      };
    } else {
      vars[toVarName(name)] = value;
    }
  }
  return vars;
};

/**
 * @internal
 * Creates root styles for color modes.
 * - Transforms color scale into CSS variables.
 * - Sets background and text color.
 */
export const __createColorStyles = (theme: Theme = {}) => {
  const { useCustomProperties, initialColorModeName, printColorModeName, useRootStyles } =
    theme.config || theme || {};
  const colors = theme.rawColors || theme.colors;

  if (!colors || useRootStyles === false) return {};
  if (useCustomProperties === false) {
    return css({
      color: 'text',
      bg: 'background',
    })(theme);
  }

  const modes = colors.modes || {};

  const styles = __createColorProperties(colors, modes);

  if (printColorModeName) {
    let printMode = modes[printColorModeName];
    if (!printMode && printColorModeName === initialColorModeName) printMode = colors;

    if (printMode) {
      styles['@media print'] = __objectToVars('clr', printMode);
    } else {
      console.error('Theme UI `printColorModeName` was not found in colors scale', {
        colors,
        printColorModeName,
      });
    }
  }

  const colorToVarValue = (color: string) => toVarValue(`clr-${color}`);

  return css({
    ...styles,
    color: colorToVarValue('text'),
    bg: colorToVarValue('background'),
  })(theme);
};

/**
 * @internal
 * Returns an object with colors turned into Custom CSS Properties and
 * .theme-ui-<colormode> classes used for no-flash serverside rendering.
 */
export function __createColorProperties(
  colors: ColorModesScale,
  modes: { [k: string]: ColorMode },
) {
  const styles = __objectToVars('clr', colors);

  Object.keys(modes).forEach((mode) => {
    const className = `.theme-ui-${mode}`;
    const key = `&${className}, ${className} &`;
    styles[key] = __objectToVars('clr', modes[mode]);
  });

  return styles;
}
