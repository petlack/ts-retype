import { ThemeProvider, useTermix } from '@ts-retype/uikit';
import { Topbar } from '@ts-retype/uikit';
import { generateTheme } from '@ts-retype/uikit/dist/generate';
import { Docs } from './components/Docs';
import { Landing } from './components/Landing';
import { Menu } from './components/Menu';
import { theme } from './ts-theme';
import '@ts-retype/uikit/dist/index.css';
import './App.scss';

function Main() {
  const { colorMode } = useTermix();
  return (
    <>
      <Topbar>
        <Menu />
      </Topbar>
      <section className="bleed" id="about">
        <Landing theme={colorMode as 'dark' | 'light'} />
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

  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}
