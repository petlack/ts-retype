import { Box } from '~/components/Box';
import { Fullscreen } from '~/layouts/Fullscreen';
import { Termix, ThemeProvider, palette } from '~/termix';

const primary = '#0a799e';
const accent = '#c68726';

export const theme: Termix = {
  config: {
  },
  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: '"Exo 2", sans-serif',
    monospace: '"Fira Code",Menlo, monospace',
  },

  colors: {
    ...palette('latte'),
    primary,
    accent,
    modes: {
      dark: {
        ...palette('mocha'),
        primary,
        accent,
      },
    },
  },

  styles: {
    root: {
      bg: 'mantle',
      color: 'text',
    },
  },
};
export default (Story: React.FC) => (
  <ThemeProvider theme={theme}>
    <Box corners='round' sx={{ bg: 'background', width: '100%', height: '100%', p: 4 }}>
      <Box sx={{ bg: null }}>
        <Story />
      </Box>
    </Box>
  </ThemeProvider>
);
