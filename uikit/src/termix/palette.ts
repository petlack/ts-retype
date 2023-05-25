import { variants } from './palettes/catppuccin.js';

export const palette = (variantName: keyof typeof variants) =>
  Object.fromEntries(Object.entries(variants[variantName]).map(([key, value]) => [key, value.hsl]));
