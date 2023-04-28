import { useCallback, useState } from 'react';
import { Page } from './Page';
import { ThemeMode, ThemeProvider } from './theme/provider';

export function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const toggleTheme = useCallback(() => {
    const nextMode = {
      light: 'dark' as ThemeMode,
      dark: 'light' as ThemeMode,
    };
    setMode(nextMode[mode]);
  }, [mode, setMode]);
  return (
    <ThemeProvider accent="#0a799e" second="#EA9615" mode={mode} body="" heading='' mono=''>
      <>
        <button style={{ position: 'fixed', top: 'var(--space-2)', right: 'var(--space-2)' }} onClick={toggleTheme}>
          {mode}
        </button>
        <Page />
      </>
    </ThemeProvider>
  );
}