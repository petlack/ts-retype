import { mocha } from './palettes/catppuccin';
import chroma from 'chroma-js';

import './Palettes.scss';

export function Palettes() {
  const colors = Object.entries(mocha).map(([name, { hsl }]) => ({ name, color: chroma(hsl) }));
  const colorsMarkup = colors.map(({ name, color }) => (
    <div className="color-info" key={name}>
      <div className="color-sample" style={{ backgroundColor: color.css() }}></div>
      <span>{name}</span>
      <span>{color.hex()}</span>
    </div>
  ));
  return (
    <div className="colors-palette">{colorsMarkup}</div>
  );
}