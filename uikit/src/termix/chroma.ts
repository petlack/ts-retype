import chroma from 'chroma-js';

function colorScale(colors: string[], numColors: number) {
  const bezier = true;
  const correctLightness = true;
  return (
    chroma
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .scale(bezier && colors.length > 1 ? chroma.bezier(colors) : colors)
      .mode('lab')
      .correctLightness(correctLightness)
      .colors(numColors)
  );
}
type ChromaPaletteProps = {
  colors?: string[];
  colors2?: string[];
  correctLightness?: boolean;
  numColors?: number;
  bezier?: boolean;
  diverging?: boolean;
};

export function scale({
  colors = ['white', 'red', 'black'],
  colors2 = [],
  numColors = 5,
  diverging = false,
}: ChromaPaletteProps = {}) {
  const even = numColors % 2 === 0;

  const numColorsLeft = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : numColors;
  const numColorsRight = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : 0;

  const stepsLeft = colors.length ? colorScale(colors, numColorsLeft) : [];
  const stepsRight = diverging && colors2.length ? colorScale(colors2, numColorsRight) : [];
  const steps = (even && diverging ? stepsLeft.slice(0, stepsLeft.length - 1) : stepsLeft).concat(
    stepsRight.slice(1),
  );

  return steps;
}
