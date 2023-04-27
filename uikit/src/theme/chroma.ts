import chroma, { InterpolationMode } from 'chroma-js';

export function range(start: number, end: number, step: number): number[] {
  const res = [];
  for (let pos = start; pos < end; pos += step) {
    res.push(pos);
  }
  return res;
}

export function autoGradient(color: string, numColors: number, diverging = false) {
  const lab = chroma(color).lab();
  const lRange = 100 * (0.95 - 1 / numColors);
  const lStep = lRange / (numColors - 1);
  const lStart = (100 - lRange) * 0.5;
  const steps = range(lStart, lStart + numColors * lStep, lStep);
  let offset = 0;
  if (!diverging) {
    offset = 9999;
    for (let i = 0; i < numColors; i++) {
      const diff = lab[0] - steps[i];
      if (Math.abs(diff) < Math.abs(offset)) {
        offset = diff;
      }
    }
  }
  return steps.map((l) => chroma.lab(l + offset, lab[1], lab[2]));
}

export type ChromaPaletteProps = {
  colors?: string[];
  colors2?: string[];
  correctLightness?: boolean;
  numColors?: number;
  bezier?: boolean;
  mode?: InterpolationMode;
  diverging?: boolean;
};

export default function chromaPalette({
  colors = ['white', 'red', 'black'],
  colors2 = [],
  correctLightness = true,
  numColors = 5,
  bezier = true,
  mode = 'lab',
  diverging = false,
}: ChromaPaletteProps = {}) {
  const even = numColors % 2 === 0;
  const numColorsLeft = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : numColors;
  const numColorsRight = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : 0;
  const genColors = colors.length !== 1 ? colors : autoColors(colors[0], numColorsLeft);
  const genColors2 = colors2.length !== 1 ? colors2 : autoColors(colors2[0], numColorsRight, true);
  const stepsLeft = colors.length
    ? chroma
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .scale(bezier && colors.length > 1 ? chroma.bezier(genColors) : genColors)
        .mode(mode)
        .correctLightness(correctLightness)
        .colors(numColorsLeft)
    : [];
  const stepsRight =
    diverging && colors2.length
      ? chroma
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .scale(bezier && colors2.length > 1 ? chroma.bezier(genColors2) : genColors2)
          .mode(mode)
          .correctLightness(correctLightness)
          .colors(numColorsRight)
      : [];
  const steps = (even && diverging ? stepsLeft.slice(0, stepsLeft.length - 1) : stepsLeft).concat(
    stepsRight.slice(1),
  );

  // log({ even, numColorsLeft, numColorsRight })
  // log({ genColors, genColors2 })
  // log({ stepsLeft, stepsRight })
  // log({ steps })

  function autoColors(color: string, numColors: number, reverse = false) {
    if (diverging) {
      const colors = autoGradient(color, 3, diverging).concat(chroma('#f5f5f5'));
      if (reverse) colors.reverse();
      return colors;
    } else {
      return autoGradient(color, numColors, diverging);
    }
  }

  return steps;
}
