import { Card, Container, Heading, Text } from 'theme-ui';
import { Box, Button, Hamburger, Logo, Search, Spinner, Tag } from '~/components';
import { FaBeer, FaDownload, FaLock, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { Drawer, Modal, Popover, PopoverContent, PopoverTrigger, Stack, Tooltip, TooltipContent, TooltipTrigger, Topbar, useToast, Wrap } from '~/layouts';
import { palette, useTermix, ThemeProvider } from './termix';
import { useCallback, useState } from 'react';
import { getColor } from '@theme-ui/color';
import { generateTheme } from '~/theme/generate';
import { readableColor } from 'polished';
import { theme } from './ts-theme.js';
import { useModal } from '~/hooks';
import { AiFillAlert } from 'react-icons/ai';
import { MdChatBubble } from 'react-icons/md';
import { GiToaster } from 'react-icons/gi';
import './fonts';
import './App.scss';

// import { Editor, importColors } from '@compai/css-gui';
// type ThemeMode = 'light' | 'dark';
//

const body = '\'Poppins\', sans-serif';
const heading = '\'Exo 2\', sans-serif';
const mono = '\'Fira Code\', monospace';
const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const generated = generateTheme({ body, heading, mono, mode: preferredTheme, accent: 'blue', second: 'orange' });

console.log({ generated });
console.log({ paletteColors: palette('latte') });

const ColorTile = ({ color, name }: { color: string, name: string }) => {
  const text = color && readableColor(color);
  return (
    <Box sx={{
      aspectRatio: 1,
      bg: color,
      color: text,
      fontSize: 'xs',
      p: 2,
      gap: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '15ch',
      borderRadius: 'md',
    }}>
      <strong>{name}</strong>
      <span>{color}</span>
    </Box>
  );
};

const ColorsPoster = () => {
  const { theme } = useTermix();

  const markup = Object.entries(theme.rawColors || {}).map(([name, value]) => <ColorTile key={name} name={name} color={getColor(theme, value)} />);
  return (
    <Wrap>
      {markup}
    </Wrap>
  );
};

const ThemeModeToggle = () => {
  const { setColorMode } = useTermix();
  return (
    <>
      <Button colorScheme='black' leftIcon={<FaMoon />} onClick={() => setColorMode('dark')}>Dark</Button>
      <Button colorScheme='white' leftIcon={<FaSun />} onClick={() => setColorMode('light')}>Light</Button>
    </>
  );
};

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isOpen, open, close, getTriggerProps, getModalProps } = useModal();
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [setIsDrawerOpen]);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [setIsDrawerOpen]);
  const toast = useToast();
  return (
    <ThemeProvider theme={theme}>
      <Container content='center' sx={{ display: 'flex', flexDirection: 'column', gap: 4, }}>

        <Card>
          <Heading>Search</Heading>
          <Search query='foo' setQuery={() => {/**/ }} />
        </Card>

        <Card>
          <Heading>Overlay</Heading>
          <Wrap>
            <Button
              colorScheme='primary'
              fill='ghost'
              size='lg'
              leftIcon={<Hamburger isOpen={isDrawerOpen} flavor='cross' />}
              onClick={openDrawer}
            >Drawer</Button>
            <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
              <Box sx={{ bg: 'primary', height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
                <Heading as='h2'>Sidebar</Heading>
                <Button onClick={closeDrawer} rightIcon={<FaTimes />}>Close</Button>
              </Box>
            </Drawer>

            <Button
              colorScheme='accent'
              fill='ghost'
              size='lg'
              leftIcon={<AiFillAlert />}
              {...getTriggerProps()}
            >Modal</Button>
            <Modal
              isOpen={isOpen}
              onClose={close}
              sx={{
                display: 'flex',
                zIndex: 100,
              }}
              {...getModalProps()}
            >
              <Card sx={{ flex: 1, width: '300px' }}>
                <Heading>Modal</Heading>
                <Text>Hello World</Text>
              </Card>
            </Modal>

            <Popover>
              <PopoverTrigger>
                <Button
                  colorScheme='green'
                  fill='ghost'
                  size='lg'
                  leftIcon={<MdChatBubble />}
                >Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Card sx={{ px: 3, py: 3, opacity: 1 }}>
                  <Heading as='h3'>Popover</Heading>
                  <Text>Hello World</Text>
                </Card>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger>
                <Button colorScheme='mauve' fill='ghost' size='lg' density='gapped'>Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <Box colorScheme='pink' fill='solid' size='sm' density='gapped' corners='pill'>Hello World</Box>
              </TooltipContent>
            </Tooltip>

            <Button
              colorScheme='flamingo'
              fill='ghost'
              size='lg'
              leftIcon={<GiToaster />}
              onClick={() => toast({ msg: 'test' })}
            >Toast</Button>

          </Wrap>
        </Card>

        <Card>
          <Heading>Logo</Heading>
          <Wrap>
            <Logo name='retype' />
            <Logo name='search' />
          </Wrap>
        </Card>

        <Card>
          <Heading>Modes</Heading>
          <Wrap>
            <ThemeModeToggle />
          </Wrap>
        </Card>

        <Card>
          <Heading>Buttons</Heading>
          <Wrap>
            <Button size='sm'>Small</Button>
            <Button colorScheme='primary'>Normal</Button>
            <Button size='lg' fill='semi' colorScheme='text'>Danger</Button>
            <Button colorScheme='green' fill='outline'>Green</Button>
            <Button colorScheme='yellow' fill='outline' corners='pill'>Yellow</Button>
            <Button colorScheme='red' fill='ghost'>Ghost</Button>
            <Button colorScheme='sky' fill='link'>Link</Button>
            <Button colorScheme='text' fill='solid' leftIcon={<FaBeer />}>Link</Button>
            <Button size='sm' colorScheme='sky' fill='outline' rightIcon={<FaLock />}>Lock</Button>
            <Button fill='outline' disabled>Disabled</Button>
            <Button colorScheme='primary' size='md' leftIcon={<Spinner flavor='grid' size='md' />} > Loading</Button>
            <Button colorScheme='primary' p={2} fill='ghost' size='lg' leftIcon={<Hamburger flavor='cross' />}></Button>
            <Button colorScheme='primary' p={2} fill='outline' size='lg' leftIcon={<FaDownload />}></Button>
            <Button colorScheme='primary' isLoading>Loading</Button>
            <Button size='md' colorScheme='primary' fill='solid' leftIcon={<FaDownload />}>Download</Button>
          </Wrap>
        </Card>

        <Card>
          <Heading>Spinners</Heading>
          <Wrap>
            <Spinner flavor='grid' />
            <Spinner flavor='code' />
            <Spinner flavor='ring' />
            <Spinner flavor='donut' />
            <Spinner flavor='comet' />
            <Spinner flavor='ripple' />
            <Spinner flavor='ellipsis' />
          </Wrap>
        </Card>

        <Card>
          <Heading>Hamburger</Heading>
          <Wrap>
            <Hamburger flavor='expand' />
            <Hamburger flavor='collapse' />
            <Hamburger flavor='cross' />
            <Hamburger flavor='shoot' />
            <Hamburger flavor='sigma' size={24} weight='black' />
          </Wrap>
        </Card>

        <Card>
          <Heading>Tags</Heading>
          <Wrap>
            <Tag fill='semi' colorScheme='yellow' size='lg' density='airy' corners='round'>test</Tag>
            <Tag colorScheme='red' size='md' weight='bold' corners='sharp'>UPPER</Tag>
            <Tag fill='outline' colorScheme='green' size='sm'>CaMel</Tag>
            <Tag colorScheme='blue' size='xs' corners='pill'>un_der</Tag>
          </Wrap>
        </Card>

        <Card>
          <Heading>Topbar Layout</Heading>
          <Topbar sx={{
            width: '30vw',
            height: '30vh',
            minWidth: '400px',
            background: 'mantle',
          }}>
            <Box sx={{
              bg: 'base',
              px: 2,
              py: 2,
              gap: 4,
              minHeight: '2em',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Logo name='uikit' />
              <Search query='' setQuery={() => {/**/ }} />
            </Box>
            <Box sx={{ flex: 1, p: 2, bg: 'mantle', color: 'text' }}>
            </Box>
          </Topbar>
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
            <p>
              150 m<sup>2</sup>.
            </p>
          </Stack>
        </Card>

        <Card>
          <Heading>Colors</Heading>
          <ColorsPoster />
        </Card>

      </Container>
    </ThemeProvider >
  );
}
