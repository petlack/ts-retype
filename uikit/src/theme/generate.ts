import { ThemeMode } from '../types/theme';
import { fromColors, namedTheme, withFonts } from './builder';

export type GenerateThemeProps = {
  accent: string;
  body: string;
  heading: string;
  mode: ThemeMode;
  mono: string;
  second: string;
};

export function generateTheme({ accent, body, heading, mode, mono, second }: GenerateThemeProps) {
  return namedTheme(mode, withFonts({ body, heading, mono }, fromColors({ accent, second, mode })));
}
