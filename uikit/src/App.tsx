import { Tag } from 'components/Tag';
import { Text } from 'components/Text';
import { SidebarLayout } from 'components/Sidebar';
import { Fullscreen } from 'layouts/Fullscreen';
import { Stack } from 'layouts/Stack';
import { FC, PropsWithChildren } from 'react';
import { Card, Container, Flex, Heading, InitializeColorMode, Theme } from 'theme-ui';
// import { ThemeProvider } from 'theme-ui';
import { Box, Label, Input, Button } from 'theme-ui';
import { ThemeProvider } from 'theme/ThemeContext';
import { useState } from 'react';
import { Editor, importColors } from '@compai/css-gui';
import { Overlay } from 'layouts/Overlay';
import { variants, labels } from 'theme/ThemeContext/palette.js';
import { ControlsTheme } from 'theme/ThemeContext/theme.js';
import { ThemePoster } from 'theme/ThemePoster';

import './App.scss';
import { Hamburger } from 'components/Hamburger';

type ThemeMode = 'light' | 'dark';

const primary = '#0a799e';
const accent = '#c68726';
const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const paletteColors = (variantName: keyof typeof variants) => Object.fromEntries(
  Object.entries(variants[variantName])
    .map(([key, value]) => ([key, value.hsl]))
);

console.log({ paletteColors });

const theme: ControlsTheme = {
  config: {
    useBorderBox: true,
    initialColorModeName: 'light',
  },

  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },

  colors: {
    ...paletteColors('latte'),
    primary: primary,
    accent: accent,
    modes: {
      dark: paletteColors('mocha'),
    }
  },

  styles: {
    root: {
      padding: 4,
      bg: 'mantle',
      color: 'text',
    }
  },

  cards: {
    primary: {
      padding: 4,
      color: 'text',
      bg: 'base',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
  },

  buttons: {
    plain: {
      cursor: 'pointer',
      color: 'text',
      '&:hover': {
        color: 'sky',
      },
    },
    'plain.small': {
      ph: 2,
      pw: 1,
      color: 'white',
    },
    primary: {
      cursor: 'pointer',
      color: 'text',
      bg: 'primary',
      '&:hover': {
        bg: 'sky',
      },
    },
    secondary: {
      cursor: 'pointer',
      color: 'background',
      bg: 'secondary',
      '&:hover': {
        bg: 'sky',
      },
    },
  },

  tags: {
    default: {
      color: 'surface2',
    },
    ok: {
      color: 'text',
      borderWidth: 1,
    },
  },
};

type SearchProps = {
  query: string;
};

const Search: FC<SearchProps> = ({ }) => {
  const [query, setQuery] = useState('');
  return (
    <Stack direction='row'>
      <Label htmlFor="search">Search</Label>
      <Input id="search" name="search" value={query} onChange={e => setQuery(e.currentTarget?.value)} />
      <Button variant='primary'>Go</Button>
    </Stack>
  );
};

export function App() {
  // const [styles, setStyles] = useState({ color: 'tomato' })
  // const colors = importColors(themeColors)
  return (
    <ThemeProvider theme={theme}>
      <InitializeColorMode />
      <Container content='center' sx={{ display: 'flex', flexDirection: 'column', gap: 4, }}>

        <Card>
          <Heading>Hello World</Heading>
          <Search query='foo' />
          <Tag variant='tags.ok'>test</Tag>
        </Card >

        <Card>
          <Heading>Sidebar Layout</Heading>
          <SidebarLayout sx={{
            width: '30vw',
            height: '30vh',
            background: 'mantle',
          }}>
            <Box sx={{ flex: 1, p: 3, paddingTop: 4, background: 'primary', color: 'background' }}>
              <Text>Hello World</Text>
            </Box>
          </SidebarLayout>
        </Card>

        <Card>
          <Heading>Hamburger</Heading>
          <Flex sx={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Hamburger flavor='expand' />
            <Hamburger flavor='collapse' />
            <Hamburger flavor='cross' />
            <Hamburger flavor='shoot' />
            <Hamburger flavor='sigma' size={24} weight='black' />
          </Flex>
        </Card>

        <ThemePoster />
        <Overlay>
        </Overlay>
      </Container>
    </ThemeProvider >
  );
}
