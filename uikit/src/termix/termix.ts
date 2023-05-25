import { getColor } from '@theme-ui/color';
import { Termix, TermixProps, TermixStyle } from './types';

function rejectNils<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null)) as T;
}

export function useTermixStyle(theme: Termix, { element, ...props }: TermixProps): TermixStyle {
  const {
    colorScheme: color = 'hotpink',
    variant = 'default',
    fill = 'solid',
    size = 'md',
    density = 'dense',
    weight = 'regular',
    corners = 'dull',
    energy = 'rigid',
    mimic = 'static',
  } = rejectNils({
    ...rejectNils(element?.default || ({} as TermixProps)),
    ...rejectNils(element?.[props.variant || 'default'] || ({} as TermixProps)),
    ...rejectNils(props),
  });

  const variants = [...variant.split('.'), fill, size, density, weight, corners];
  // const variants = [...variant.split('.')];
  const fillStyles = (color && theme.fill?.[fill]({ color: getColor(theme, color) })) || {};
  const mimicStyles = theme.mimic?.[mimic]({ color: getColor(theme, color) }) || {};

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
