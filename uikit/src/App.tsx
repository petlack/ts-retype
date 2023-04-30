import { useCallback, useState } from 'react';
import { Page } from './Page';
import { ThemeProvider } from './theme/provider';
import { generateTheme } from './theme/generate';
import { ThemeMode } from './theme';

const accent = '#0a799e';
const second = '#c68726';
const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const toggleTheme = useCallback(() => {
    const nextMode = {
      light: 'dark' as ThemeMode,
      dark: 'light' as ThemeMode,
    };
    setMode(nextMode[mode]);
  }, [mode, setMode]);
  const theme = generateTheme({ accent, body, heading, mono, second, mode: preferredTheme });
  return (
    <ThemeProvider theme={theme}>
      <>
        <button style={{ position: 'fixed', top: 'var(--space-2)', right: 'var(--space-2)' }} onClick={toggleTheme}>
          {mode}
        </button>
        <Page />
      </>
    </ThemeProvider>
  );
}