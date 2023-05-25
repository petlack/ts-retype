import { Tag } from 'components/Tag';
import { Text } from 'components/Text';
import { SidebarLayout } from 'components/Sidebar';
import { Fullscreen } from 'layouts/Fullscreen';
import { Stack } from 'layouts/Stack';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  InitializeColorMode,
  Input,
  Label,
  useThemeUI,
} from 'theme-ui';
// import { ThemeProvider } from 'theme-ui';
import { ThemeProvider } from 'theme/ThemeContext';
import { Editor, importColors } from '@compai/css-gui';
import { Hamburger } from 'components/Hamburger';
import { Overlay } from 'layouts/Overlay';
import { variants, labels } from 'theme/ThemeContext/palette.js';
import { ControlsTheme } from 'theme/ThemeContext/theme.js';
import { ThemePoster } from 'theme/ThemePoster';
import { theme } from './ts-theme.js';
import './App.scss';

type ThemeMode = 'light' | 'dark';

const body = '\'Noto Sans\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const paletteColors = (variantName: keyof typeof variants) => Object.fromEntries(
  Object.entries(variants[variantName])
    .map(([key, value]) => ([key, value.hsl]))
);

console.log({ paletteColors: paletteColors('latte') });

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16}>
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
  </svg>
);

type SearchProps = {
  query: string;
};

const Search: FC<SearchProps> = ({ }) => {
  const [query, setQuery] = useState('');
  return (
    <Grid sx={{ gridTemplateColumns: 'min-content 1fr', gap: 3, alignItems: 'center' }}>
      <Label htmlFor="search"><SearchIcon /></Label>
      <Input id="search" name="search" value={query} onChange={e => setQuery(e.currentTarget?.value)} placeholder='Search ...' />
    </Grid>
  );
};

const Buttons = () => {
  const context = useThemeUI();
  const { theme } = context;

  const markup = Object.keys(theme.buttons || {}).map(variant => <Button key={variant} variant={variant}>{variant}</Button>);
  return (
    <>
      {markup}
    </>
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
          <Heading>Search</Heading>
          <Search query='foo' />
        </Card>

        <Card>
          <Heading>Buttons</Heading>
          <Flex sx={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Buttons />
          </Flex>
        </Card>

        <Card>
          <Heading>Tags</Heading>
          <Flex sx={{ gap: 2, alignItems: 'flex-start' }}>
            <Tag fill='semi' color='yellow' size='lg' density='airy' corners='round'>test</Tag>
            <Tag color='red' size='md' weight='bold' corners='sharp'>UPPER</Tag>
            <Tag fill='outline' color='green' size='sm'>CaMel</Tag>
            <Tag color='blue' size='xs' corners='pill'>un_der</Tag>
          </Flex>
        </Card>

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
