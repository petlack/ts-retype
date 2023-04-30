import { useTheme } from '../theme';
import './UiKitApp.styl';

export type AppProps = {
  children: JSX.Element | JSX.Element[];
}

export function UiKitApp({ children }: AppProps) {
  const { theme } = useTheme();
  return (
    <main className={theme.name}>
      {children}
    </main>
  );
}