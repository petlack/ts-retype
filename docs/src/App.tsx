import { ThemeProvider, useTermix } from '@ts-retype/uikit';
import { Topbar } from '@ts-retype/uikit';
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

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}
