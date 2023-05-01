import { useTheme, ThemeMode, ThemeProvider } from '@ts-retype/uikit';
import { UiKitApp } from '@ts-retype/uikit';
import { TopBar } from '@ts-retype/uikit';
import { generateTheme } from '@ts-retype/uikit';
import { Docs } from './components/Docs';
import { Landing } from './components/Landing';
import { Menu } from './components/Menu';
import '@ts-retype/uikit/dist/index.css';
import './App.scss';

function Main() {
  const { theme } = useTheme();
  const mode = theme.name as ThemeMode;
  return (
    <>
      <TopBar>
        <Menu />
      </TopBar>
      <section className="bleed" id="about">
        <Landing theme={mode} />
      </section>
      <Docs />
      <footer></footer>
    </>
  );
}

const accent = '#0a799e';
const second = '#c68726';
const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = typeof window !== 'undefined' ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';
// const preferredTheme = 'dark' as ThemeMode;

export default function App() {
  const theme = generateTheme({ accent, body, heading, mono, second, mode: preferredTheme });

  return (
    <ThemeProvider theme={theme}>
      <UiKitApp>
        <Main />
      </UiKitApp>
    </ThemeProvider>
  );
}
