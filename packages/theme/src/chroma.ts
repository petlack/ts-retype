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

// function colorScale(colors: string[], numColors: number) {
//   return [...Array(numColors).keys()].map(() => colors[0]);
// }

type ChromaPaletteProps = {
  colors?: string[];
  colors2?: string[];
  correctLightness?: boolean;
  numColors?: number;
  bezier?: boolean;
  diverging?: boolean;
};

export default function chromaPalette({
    colors = ['white', 'red', 'black'],
    colors2 = [],
    correctLightness = true,
    numColors = 5,
    bezier = true,
    diverging = false,
}: ChromaPaletteProps = {}) {
    const even = numColors % 2 === 0;
    const numColorsLeft = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : numColors;
    const numColorsRight = diverging ? Math.ceil(numColors / 2) + (even ? 1 : 0) : 0;
    // const genColors = colors.length !== 1 ? colors : autoColors(colors[0], numColorsLeft, diverging, false);
    // const genColors2 = colors2.length !== 1 ? colors2 : autoColors(colors2[0], numColorsRight, diverging, true);

    const stepsLeft = colors.length ? colorScale(colors, numColorsLeft) : [];
    const stepsRight = diverging && colors2.length ? colorScale(colors2, numColorsRight) : [];
    const steps = (even && diverging ? stepsLeft.slice(0, stepsLeft.length - 1) : stepsLeft).concat(
        stepsRight.slice(1),
    );

    return steps;
}
