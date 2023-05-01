import type { Meta, StoryObj } from '@storybook/react';

import { WithBash } from 'code/WithBash';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/WithBash',
  component:  WithBash,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof  WithBash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    lines: [
      [<span>ping localhost</span>],
      [<span>ping 127.0.0.1</span>],
    ],
  },
};
