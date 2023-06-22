import { Termix, TermixProps, TermixStyle } from './types';
import { getColor } from '@theme-ui/color';
import { fromColors, ofColor, readableColor } from './mixer';
import { mergeDeepRight } from 'ramda';
import { Tx, ComponentsDef, cx, Sx, termixDef, TermixDef } from './tx';

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

export function useTermixStyle(theme: Termix, { element, ...props }: TermixProps): TermixStyle {
  const {
    colorScheme: color,
    variant = 'default',
    fill = 'ghost',
    sizing = 'md',
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

  const variants = [...variant.split('.'), fill, sizing, density, weight, corners];
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
    theme.sizing?.[sizing],
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

export function mergeTx(tx?: Tx, element?: keyof ComponentsDef): Required<Tx> {
  // const asTx = element && (tx?.variant && tx?.variant !== 'default' ? cx[element]?.variants?.[tx?.variant]?.tx : cx[element]?.default?.tx) || ({} as Tx);

  const asTx =
    (element && {
      ...(cx[element]?.default?.tx ?? {}),
      ...((tx?.variant && tx?.variant !== 'default' && cx[element]?.variants?.[tx?.variant]?.tx) ||
        {}),
    }) ||
    ({} as Tx);

  const defaultTx: Required<Tx> = {
    colorScheme: asTx.colorScheme || 'text',
    variant: asTx.variant || 'default',
    fill: asTx.fill || 'default',
    corners: asTx.corners || 'default',
    density: asTx.density || 'default',
    energy: asTx.energy || 'default',
    mimic: asTx.mimic || 'default',
    speed: asTx.speed || 'default',
    sizing: asTx.sizing || 'default',
    weight: asTx.weight || 'default',
  };
  const mergedTx = {
    ...defaultTx,
    ...(tx || {}),
  };
  return mergedTx;
}

export function termix(theme: Termix, tx?: Tx, element?: keyof ComponentsDef): Sx {
  const mergedTx = mergeTx(tx, element);
  const overrides = (element && cx[element]?.overrides) || {};
  const txDef = mergeDeepRight(termixDef, overrides) as TermixDef;

  const fill = txDef.fill[mergedTx.fill];
  const corners = txDef.corners[mergedTx.corners];
  const density = txDef.density[mergedTx.density];
  const energy = txDef.energy[mergedTx.energy];
  const mimic = txDef.mimic[mergedTx.mimic];
  const speed = txDef.speed[mergedTx.speed];
  const sizing = txDef.sizing[mergedTx.sizing];
  const weight = txDef.weight[mergedTx.weight];

  const colorStyles = fill?.({ tx: mergedTx, theme }) ?? {};
  const cornersStyles = corners;
  const densityStyles = density;
  const energyStyles = energy;
  const mimicStyles = mimic({ tx: mergedTx, theme });
  const speedStyles = speed;
  const sizingStyles = sizing;
  const weightStyles = weight;

  const asSx =
    (element && {
      ...(cx[element]?.default?.sx ?? {}),
      ...((tx?.variant && tx?.variant !== 'default' && cx[element]?.variants?.[tx?.variant]?.sx) ||
        {}),
    }) ||
    ({} as Sx);

  return {
    ...asSx,
    ...mimicStyles,
    ...colorStyles,
    ...cornersStyles,
    ...densityStyles,
    ...energyStyles,
    ...speedStyles,
    ...weightStyles,
    ...sizingStyles,
  };
}
