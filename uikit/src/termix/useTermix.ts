import { useThemeUI } from 'theme-ui';
import { Termix } from './types';

export function useTermix() {
  const context = useThemeUI();
  return context.theme as Termix;
}
