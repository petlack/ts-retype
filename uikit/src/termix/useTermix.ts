import { useColorMode, useThemeUI } from 'theme-ui';
import { Termix } from './types';

export function useTermix() {
  const context = useThemeUI();
  const [colorMode, setColorMode] = useColorMode();
  return { theme: context.theme as Termix, colorMode, setColorMode };
}
