import { Landing } from './components/Landing';
import { Menu } from './components/Menu';
import { TopBar } from '@ts-retype/uikit/src/components/TopBar';
import { useTheme, ThemeMode, ThemeProvider } from '@ts-retype/uikit/src/theme';
import { Docs } from './components/Docs';
import { UiKitApp } from '@ts-retype/uikit/src/components/UiKitApp';
import { useState } from 'react';
import './App.styl';

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
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
// const preferredTheme = 'dark';

export default function App() {
  const [themeName, setThemeName] = useState<ThemeMode>(preferredTheme);

  return (
    <ThemeProvider accent={accent} second={second} mode={themeName} { ...{ body, heading, mono } }>
      <UiKitApp theme={themeName}>
        <Main />
      </UiKitApp>
    </ThemeProvider>
  );
}
