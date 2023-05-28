import { desaturate as polishedDesaturate, readableColor as polishedReadableColor } from 'polished';
import { scale } from './chroma.js';

export type ColorScale = { [shade: string | number]: string };

export function desaturate(color: string) {
  // return chroma(color)
  //   .set('hsl.s', '0.10')
  //   .set('hsl.l', '0.66')
  //   .hex();
  return polishedDesaturate(0.75, color);
}

export function readableColor(bg: string, white?: string, black?: string, strict?: boolean) {
  try {
    return polishedReadableColor(bg, white, black, strict);
  } catch (e: any) {
    return white;
  }
}

const WHITE = 42;
const BLACK = 17;
const [FG, BG] = [9, 31];

function findPositive(color: string): string {
  const values = scale({ colors: ['white', color], numColors: WHITE, bezier: false });
  return values.at(1) || 'white';
}

function findNegative(color: string): string {
  const values = scale({ colors: ['black', color], numColors: BLACK, bezier: false });
  return values.at(1) || 'black';
}

function findFg(color: string): string {
  const values = scale({ colors: ['black', color], numColors: FG, bezier: false });
  return values.at(1) || 'black';
}

function findBg(color: string): string {
  const values = scale({ colors: ['white', color], numColors: BG, bezier: false });
  return values.at(1) || 'black';
}

function toColorScale(colors: string[]): ColorScale {
  const steps = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975];
  return Object.fromEntries(colors.map((color, idx) => [steps[idx], color])) as ColorScale;
}

export function ofColor(color: string, bg: string, fg: string): ColorScale {
  const leftHalf = scale({ colors: [bg, color], numColors: 6 }).slice(1);
  const rightHalf = scale({ colors: [color, fg], numColors: 8 }).slice(1, -1);
  const beforeLeft = scale({ colors: [bg, leftHalf.at(0) || bg], numColors: 4 }).slice(1, -1);
  const colorBgFg = [...beforeLeft, ...leftHalf, ...rightHalf];
  const colorScale = toColorScale(colorBgFg);
  return colorScale;
}

export function fromColors({
  accent,
  mode,
  ...rest
}: {
  accent: string;
  mode: 'dark' | 'light';
  [key: string]: string;
}): {
  white: string;
  black: string;
  bg: string;
  fg: string;
  neutral: string;
  scales: { [name: string]: ColorScale };
} {
  const positive = findPositive(accent);
  const negative = findNegative(accent);
  const positiveNext = findFg(accent);
  const negativeNext = findBg(accent);

  const [white, fg, black, bg] =
    mode === 'light'
      ? [positive, positiveNext, negative, negativeNext]
      : [negative, negativeNext, positive, positiveNext];

  const accentScale = ofColor(accent as string, white as string, black as string);
  const neutralAccent = desaturate(accent as string);
  const neutralAccentScale = ofColor(neutralAccent as string, white as string, black as string);

  return {
    white,
    black,
    bg,
    fg,
    neutral: neutralAccent,
    scales: {
      accent: accentScale,
      neutral: neutralAccentScale,
      ...Object.fromEntries(
        Object.entries(rest).map(([name, color]) => [
          name,
          ofColor(color as string, bg as string, fg as string),
        ]),
      ),
    },
  };
}
