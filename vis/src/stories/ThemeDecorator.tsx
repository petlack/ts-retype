import { ThemeProvider, theme } from '@ts-retype/uikit';
// import { generateTheme } from '@ts-retype/uikit/generate';

const accent = '#0a799e';
const second = '#c68726';
const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = typeof window !== 'undefined' ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';

// const theme = generateTheme({ accent, body, heading, mono, second, mode: preferredTheme });

export default (Story: React.FC) => (
  <ThemeProvider theme={theme}>
    <main className="light">
      <Story />
    </main>
  </ThemeProvider>
);
