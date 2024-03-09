import type { Preview } from '@storybook/react';

import '@ts-retype/uikit/dist/index.css';
import '../src/App.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
