import type { Color, ColorScale, Theme, ThemeMode } from './theme.js';
import chromaPalette from './chroma.js';
import { desaturate as polishedDesaturate } from 'polished';

function desaturate(color: string) {
    // return chroma(color)
    //   .set('hsl.s', '0.10')
    //   .set('hsl.l', '0.66')
    //   .hex();
    return polishedDesaturate(0.75, color);
}

function toColorScale(colors: Color[]): ColorScale {
    const steps = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975];
    return Object.fromEntries(colors.map((color, idx) => [steps[idx], color])) as ColorScale;
}

const WHITE = 42;
const BG = 31;
// const BG50 = 62;
const BLACK = 17;
// const FG50 = 13;
const FG = 9;

function findPositive(color: string): string {
    const scale = chromaPalette({ colors: ['white', color], numColors: WHITE, bezier: false });
    return scale.at(1) || 'white';
}

function findNegative(color: string): string {
    const scale = chromaPalette({ colors: ['black', color], numColors: BLACK, bezier: false });
    return scale.at(1) || 'black';
}

function findFg(color: string): string {
    const scale = chromaPalette({ colors: ['black', color], numColors: FG, bezier: false });
    return scale.at(1) || 'black';
}

function findBg(color: string): string {
    const scale = chromaPalette({ colors: ['white', color], numColors: BG, bezier: false });
    return scale.at(1) || 'black';
}

export function ofColor(color: string, bg: string, fg: string) {
    const leftHalf = chromaPalette({ colors: [bg, color], numColors: 6 })
        .slice(1);
    const rightHalf = chromaPalette({ colors: [color, fg], numColors: 8 })
        .slice(1, -1);
    const beforeLeft = chromaPalette({ colors: [bg, leftHalf.at(0) || bg], numColors: 4 })
        .slice(1, -1);
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
  mode: ThemeMode;
  [key: string]: string;
}): Theme {
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
        accent: accentScale,
        neutral: neutralAccentScale,
        transparent: 'transparent',
        current: 'currentColor',
        ...Object.fromEntries(
            Object.entries(rest).map(([name, color]) => [
                name,
                ofColor(color as string, bg as string, fg as string),
            ]),
        ),
    };
}
