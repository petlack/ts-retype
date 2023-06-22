import { Container, Heading, Text } from 'theme-ui';
import { Box, BoxProps, Button, Card, Hamburger, Input, Label, Logo, Search, Spinner, Tag } from '~/components';
import { FaBeer, FaDownload, FaEnvelope, FaInfo, FaKey, FaLock, FaMinus, FaMoon, FaPlus, FaRocketchat, FaSun, FaTimes } from 'react-icons/fa';
import { Drawer, Grid, Modal, Popover, PopoverContent, PopoverTrigger, Stack, Tooltip, TooltipContent, TooltipTrigger, Topbar, useToast, Wrap } from '~/layouts';
import { Options, OptionItem as Option } from './layouts/Options';
import { readableColor, useTermix, ThemeProvider } from './termix';
import { useCallback, useState } from 'react';
import { getColor } from '@theme-ui/color';
import { theme } from './ts-theme.js';
// import { theme } from './termix/theme.js';
import { useModal } from '~/hooks';
import { AiFillAlert } from 'react-icons/ai';
import { Radio } from './components/Radio';
import './fonts';
import './App.scss';

const ColorTile = ({ color, name }: { color: string, name: string }) => {
  const text = color && readableColor(color);
  return (
    <Box
      tx={{
        mimic: 'morph',
        energy: 'live',
        colorScheme: color,
      }}
      sx={{
        bg: color,
        color: text,
        fontSize: 'xs',
        cursor: 'pointer',
        p: 2,
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '18ch',
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
      <Button tx={{ colorScheme: 'text' }} leftIcon={<FaMoon />} onClick={() => setColorMode('dark')}>Dark</Button>
      <Button tx={{ colorScheme: 'mantle' }} leftIcon={<FaSun />} onClick={() => setColorMode('light')}>Light</Button>
    </>
  );
};

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isOpen, close, getTriggerProps, getModalProps } = useModal();
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [setIsDrawerOpen]);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [setIsDrawerOpen]);
  const toast = useToast();

  const optionStyles: BoxProps['sx'] = {
    position: 'relative',
    px: 2,
    cursor: 'default',
    borderRadius: 'md',
    userSelect: 'none',
    transition: '150ms ease-in',
    transitionProperty: 'background,color',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 'calc(50% - var(--size-1) / 2)',
      left: '0',
      width: 'var(--size-1)',
      height: 'var(--size-1)',
      bg: 'transparent',
      transition: '150ms ease-in',
      transitionProperty: 'background,color',
    },
    '&:hover': {
      '&:before': {
        bg: 'primary-200',
      },
    },
    '&[aria-checked=\'true\']': {
      bg: 'primary',
      color: 'white',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        content='center'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          p: 4,
        }}>

        <Card>
          <Heading>Search</Heading>
          <Search query='foo' setQuery={() => {/**/ }} />
        </Card>

        <Stack sx={{ gap: 4, alignItems: 'stretch' }}>
          <Heading as='h2'>Options</Heading>
          <Grid sx={{ gap: 4, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Card>
              <Heading as='h3'>with radio</Heading>
              <Options name='foo' tx={{ corners: 'round' }} sx={{ p: 2, gap: 2, width: 'max-content', overflow: 'hidden' }}>
                <Option value='hello'>
                  <Label>
                    <Radio name='foo' value='hello' />
                    <Text>Hello</Text>
                  </Label>
                </Option>
                <Option value='world'>
                  <Label>
                    <Radio name='foo' value='world' />
                    <Text>World</Text>
                  </Label>
                </Option>
              </Options>
            </Card>

            <Card>
              <Heading as='h3'>custom element</Heading>
              <Options name='foo' tx={{ corners: 'round' }} sx={{ p: 2, gap: 2, width: 'max-content', overflow: 'hidden' }}>
                <Option value='hello'>
                  <Box sx={optionStyles}>Hello</Box>
                </Option>
                <Option value='world'>
                  <Box sx={optionStyles}>World</Box>
                </Option>
                <Option value='bar'>
                  <Box sx={optionStyles}>Foo Bar</Box>
                </Option>
                <Option value='baz'>
                  <Box sx={optionStyles}>Baz</Box>
                </Option>
                <Option value='xyz'>
                  <Box sx={optionStyles}>XYZ</Box>
                </Option>
              </Options>
            </Card>

            <Card>
              <Heading as='h3'>Radio</Heading>
              <Stack sx={{ gap: 2 }} align='start'>
                <Stack as='form' p={2} sx={{ gap: 2 }}>
                  <Label>
                    <Radio tx={{ colorScheme: 'accent' }} name='msg' value='hello' />
                    Hello
                  </Label>
                  <Label>
                    <Radio name='msg' value='world' defaultChecked />
                    <Text>World</Text>
                  </Label>
                  <Label>
                    <Radio name='msg' value='foo' />
                    <Text>Foo Bar</Text>
                  </Label>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Stack>

        <Stack align='stretch' sx={{ gap: 4 }}>
          <Heading as='h2'>Options</Heading>
          <Wrap sx={{ alignItems: 'stretch' }}>
            <Card>
              <Heading as='h3'>Checkbox</Heading>
            </Card>
            <Card>
              <Heading as='h3'>Number</Heading>
            </Card>
            <Card>
              <Heading as='h3'>Input</Heading>
              <Grid sx={{ columnGap: 3, rowGap: 2, gridTemplateColumns: 'max-content 1fr', alignContent: 'center', justifyContent: 'stretch' }}>
                <Label htmlFor='inputs-number'>Number</Label>
                <Input
                  type='number'
                  id='inputs-number'
                  tx={{ colorScheme: 'mauve' }}
                  leftOuter={<Button tx={{ fill: 'ghost' }} sx={{ p: 0, aspectRatio: 1, width: '2em', justifyContent: 'center' }}><FaMinus /></Button>}
                  rightOuter={<Button tx={{ fill: 'ghost' }} sx={{ p: 0, aspectRatio: 1, width: '2em', justifyContent: 'center' }}><FaPlus /></Button>}
                />
                <Label htmlFor='inputs-name'>Name</Label>
                <Input
                  type='text'
                  id='inputs-name'
                  placeholder='Name'
                  tx={{ colorScheme: 'flamingo' }}
                  rightInner={<Button tx={{ sizing: 'small', fill: 'ghost' }}>Show</Button>}
                />
                <Label htmlFor='inputs-password'>Password</Label>
                <Input type='password' id='inputs-password' placeholder='Password' rightOuter={<FaKey />} tx={{ colorScheme: 'green' }} />
                <Label htmlFor='inputs-email'>Email</Label>
                <Input type='email' id='inputs-email' placeholder='Email' leftOuter={<FaEnvelope />} />
                <Label htmlFor='inputs-url'>URL</Label>
                <Input
                  type='url'
                  id='inputs-url'
                  placeholder='URL'
                  size={4}
                  width='auto'
                  leftOuter={<Text sx={{ lineHeight: 1 }}>https://</Text>}
                  rightOuter={<Text sx={{ lineHeight: 1 }}>.example.com</Text>}
                />
              </Grid>
            </Card>
          </Wrap>
        </Stack>

        <Card>
          <Heading>Overlay</Heading>
          <Wrap>
            <Button
              tx={{
                colorScheme: 'primary',
                fill: 'ghost',
                sizing: 'lg',
                mimic: 'invert',
              }}
              leftIcon={<Hamburger isOpen={isDrawerOpen} flavor='cross' />}
              onClick={openDrawer}
            >Drawer</Button>
            <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
              <Box
                tx={{ colorScheme: 'primary-600', fill: 'solid' }}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}
              >
                <Heading as='h2'>Sidebar</Heading>
                <Button onClick={closeDrawer} rightIcon={<FaTimes />}>Close</Button>
              </Box>
            </Drawer>

            <Button
              tx={{
                colorScheme: 'blue',
                fill: 'ghost',
                sizing: 'lg',
              }}
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
                  tx={{
                    colorScheme: 'green',
                    fill: 'ghost',
                    sizing: 'lg',
                  }}
                  leftIcon={<FaRocketchat />}
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
                <Button tx={{ colorScheme: 'purple', fill: 'ghost', sizing: 'lg', density: 'gapped' }}> Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <Box tx={{ colorScheme: 'pink', fill: 'solid', sizing: 'sm', density: 'gapped', corners: 'pill' }}>Hello World</Box>
              </TooltipContent>
            </Tooltip>

            <Button
              tx={{
                colorScheme: 'orange',
                fill: 'ghost',
                sizing: 'lg',
              }}
              leftIcon={<FaInfo />}
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
            <Button tx={{ sizing: 'sm' }}>Small</Button>
            <Button tx={{ colorScheme: 'primary' }}>Normal</Button>
            <Button tx={{ sizing: 'lg', fill: 'semi', colorScheme: 'text' }}>Danger</Button>
            <Button tx={{ sizing: '3xl', fill: 'solid', colorScheme: 'sky' }}>Extra Large</Button>
            <Button tx={{ colorScheme: 'green', fill: 'outline' }}>Green</Button>
            <Button tx={{ colorScheme: 'yellow', fill: 'outline', corners: 'pill' }}>Yellow</Button>
            <Button tx={{ colorScheme: 'red', fill: 'ghost' }}>Ghost</Button>
            <Button tx={{ colorScheme: 'blue', fill: 'link' }}>Link</Button>
            <Button tx={{ colorScheme: 'text', fill: 'solid' }} leftIcon={<FaBeer />}>Link</Button>
            <Button tx={{ colorScheme: 'blue', fill: 'outline', sizing: 'sm' }} rightIcon={<FaLock />}>Lock</Button>
            <Button tx={{ fill: 'outline' }} disabled>Disabled</Button>
            <Button tx={{ colorScheme: 'primary', sizing: 'md' }} leftIcon={<Spinner flavor='grid' sizing='md' />} > Loading</Button>
            <Button tx={{ colorScheme: 'primary', fill: 'ghost', sizing: 'lg' }} p={2} leftIcon={<Hamburger flavor='cross' />}></Button>
            <Button tx={{ colorScheme: 'primary', fill: 'outline', sizing: 'lg' }} p={2} leftIcon={<FaDownload />}></Button>
            <Button tx={{ colorScheme: 'primary' }} isLoading>Loading</Button>
            <Button tx={{ colorScheme: 'primary', fill: 'solid', sizing: 'md' }} leftIcon={<FaDownload />}>Download</Button>
          </Wrap >
        </Card >

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
            <Tag tx={{ fill: 'semi', colorScheme: 'yellow', sizing: 'lg', density: 'airy', corners: 'round' }}>test</Tag>
            <Tag tx={{ colorScheme: 'red', sizing: 'md', weight: 'bold', corners: 'sharp' }}>UPPER</Tag>
            <Tag tx={{ fill: 'outline', colorScheme: 'green', sizing: 'sm' }}>CaMel</Tag>
            <Tag tx={{ colorScheme: 'blue', sizing: 'xs', corners: 'pill' }}>un_der</Tag>
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
              color: 'text',
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

      </Container >
    </ThemeProvider >
  );
}
