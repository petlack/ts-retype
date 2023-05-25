import { Tag } from 'components/Tag';
import { Text } from 'components/Text';
import { SidebarLayout } from 'components/Sidebar';
import { FC, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Label,
} from 'theme-ui';
import { ThemeProvider, palette, useTermix } from './termix';
// import { Editor, importColors } from '@compai/css-gui';
import { Hamburger } from './components/Hamburger';
import { Overlay } from './layouts/Overlay';
import { ThemePoster } from 'theme/ThemePoster';
import { theme } from './ts-theme.js';
import './App.scss';
import { Button } from 'components/Button';
import { Stack } from 'layouts/Stack';
import { FaBeer } from 'react-icons/fa';
import { AiFillMail } from 'react-icons/ai';

// type ThemeMode = 'light' | 'dark';
//
// const body = '\'Noto Sans\', sans-serif';
// const heading = '\'Exo 2\', sans-serif';
// const mono = '\'Fira Code\', monospace';
// const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

console.log({ paletteColors: palette('latte') });

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={16} height={16}>
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
  </svg>
);

type SearchProps = {
  query: string;
};

const Search: FC<SearchProps> = () => {
  const [query, setQuery] = useState('');
  return (
    <Grid sx={{ gridTemplateColumns: 'min-content 1fr', gap: 3, alignItems: 'center' }}>
      <Label htmlFor="search"><SearchIcon /></Label>
      <Input id="search" name="search" value={query} onChange={e => setQuery(e.currentTarget?.value)} placeholder='Search ...' />
    </Grid>
  );
};

const ColorsPoster = () => {
  const theme = useTermix();

  const markup = Object.entries(theme.colors || {}).map(([name, value]) => <Box key={name} sx={{ aspectRatio: 1, bg: value }}></Box>);
  return (
    <Grid columns={10}>
      {markup}
    </Grid>
  );
};

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container content='center' sx={{ display: 'flex', flexDirection: 'column', gap: 4, }}>

        <Card>
          <Heading>Search</Heading>
          <Search query='foo' />
        </Card>

        <Card>
          <Heading>Buttons</Heading>
          <Flex sx={{ flexFlow: 'row wrap', alignItems: 'center', gap: 4 }}>
            <Button size='sm'>Small</Button>
            <Button colorScheme='primary'>Normal</Button>
            <Button size='lg' fill='semi' colorScheme='red'>Danger</Button>
            <Button colorScheme='green' fill='outline'>Green</Button>
            <Button colorScheme='yellow' fill='outline' corners='pill'>Yellow</Button>
            <Button colorScheme='text' fill='ghost'>Ghost</Button>
            <Button colorScheme='sky' fill='link'>Link</Button>
            <Button colorScheme='text' fill='solid' leftIcon={<FaBeer />}>Link</Button>
            <Button colorScheme='blue' fill='outline' leftIcon={<AiFillMail />}>Link</Button>
            <Button fill='outline' disabled>Disabled</Button>
          </Flex>
        </Card>

        <Card>
          <Heading>Tags</Heading>
          <Flex sx={{ gap: 2, alignItems: 'flex-start' }}>
            <Tag fill='semi' colorScheme='yellow' size='lg' density='airy' corners='round'>test</Tag>
            <Tag colorScheme='red' size='md' weight='bold' corners='sharp'>UPPER</Tag>
            <Tag fill='outline' colorScheme='green' size='sm'>CaMel</Tag>
            <Tag colorScheme='blue' size='xs' corners='pill'>un_der</Tag>
          </Flex>
        </Card>

        <Card>
          <Heading>Sidebar Layout</Heading>
          <SidebarLayout sx={{
            width: '30vw',
            height: '30vh',
            minWidth: '400px',
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

        <Card>
          <Heading>Typography</Heading>
          <Stack sx={{ gap: 2 }}>
            <Heading as='h1'>First Level</Heading>
            <Heading as='h2'>Second Stage</Heading>
            <Heading as='h3'>Third Category</Heading>
            <Heading as='h4'>Fourth Indent</Heading>
            <Heading as='h5'>Fifth Call</Heading>
            <p>
              Nullam quis risus eget <a href='#'>urna mollis ornare</a> vel eu leo. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh
              ultricies vehicula.
            </p>
            <p>
              <small>This line of text is meant to be treated as fine print.</small>
            </p>
            <p>
              The following snippet of text is <strong>rendered as bold text</strong>.
            </p>
            <p>
              The following snippet of text is <em>rendered as italicized text</em>.
            </p>
            <p>
              An abbreviation of the word attribute is <abbr title='attribute'>attr</abbr>.
            </p>

          </Stack>
        </Card>

        <Card>
          <Heading>Colors</Heading>
          <ColorsPoster />
        </Card>

        <ThemePoster />
        <Overlay>
        </Overlay>
      </Container>
    </ThemeProvider >
  );
}
