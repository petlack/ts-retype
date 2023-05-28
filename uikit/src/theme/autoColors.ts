import chroma from 'chroma-js';

function range(start: number, end: number, step: number): number[] {
  const res = [];
  for (let pos = start; pos < end; pos += step) {
    res.push(pos);
  }
  return res;
}

function autoGradient(color: string, numColors: number, diverging = false) {
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

export function autoColors(color: string, numColors: number, diverging = false, reverse = false) {
  if (diverging) {
    const colors = autoGradient(color, 3, diverging);
    if (reverse) colors.reverse();
    return colors;
  } else {
    return autoGradient(color, numColors, diverging);
  }
}
