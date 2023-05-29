import { Termix, TermixProps, TermixStyle } from './types';
import { getColor } from '@theme-ui/color';
import { fromColors, ofColor, readableColor } from './mixer';
import { ThemeUIStyleObject } from 'theme-ui';

function rejectNils<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null)) as T;
}

export function paletteColorScales(
  mode: 'light' | 'dark',
  primary: string,
  modeColors: { [k: string]: string },
) {
  const paletteColors = fromColors({ ...modeColors, accent: primary, mode });
  const scales = Object.entries(modeColors)
    .map(([k, v]) => ({
      [k]: v.toString(),
      ...Object.fromEntries(
        Object.entries(ofColor(v, paletteColors.bg.toString(), paletteColors.fg.toString())).map(
          ([s, c]) => [`${k}-${s}`, c],
        ),
      ),
    }))
    .reduce((res, item) => ({ ...res, ...item }));
  return scales;
}

export function useTermixStyle(
  theme: Termix,
  { element, ...props }: TermixProps,
): ThemeUIStyleObject {
  const {
    colorScheme: color,
    variant = 'default',
    fill = 'ghost',
    size = 'md',
    density = 'packed',
    weight = 'regular',
    corners = 'sharp',
    energy = 'rigid',
    mimic = 'static',
  } = rejectNils({
    ...rejectNils(element?.default || ({} as TermixProps)),
    ...rejectNils(element?.[props.variant || 'default'] || ({} as TermixProps)),
    ...rejectNils(props),
  });

  const variants = [...variant.split('.'), fill, size, density, weight, corners];
  // const variants = [...variant.split('.')];
  const fillStyles = color
    ? (color &&
        theme.fill?.[fill]({
          colorScheme: color,
          color: getColor(theme, color),
          readable: readableColor(getColor(theme, color)),
        })) ||
      {}
    : {};
  const mimicStyles = color
    ? theme.mimic?.[mimic]({
        colorScheme: color,
        color: getColor(theme, color),
        readable: readableColor(getColor(theme, color)),
      }) || {}
    : {};

  const variantsStyles = [
    fillStyles,
    mimicStyles,
    theme.weight?.[weight],
    theme.size?.[size],
    theme.corners?.[corners],
    theme.density?.[density],
    theme.energy?.[energy],
    ...variants.map((variant) => (variant && element?.[variant]) || {}),
  ];

  const mergedStyles = variantsStyles.reduce(
    (res, item) => (item ? { ...res, ...item } : res),
    {} as TermixStyle,
  ) as TermixStyle;

  return mergedStyles;
}
