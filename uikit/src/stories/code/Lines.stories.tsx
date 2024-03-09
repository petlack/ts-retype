import type { Meta, StoryObj } from '@storybook/react';

import { Lines } from 'code/Lines';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/Lines',
  component:  Lines,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof  Lines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Custom: Story = {
  args: {
    char: '$',
    lines: [
      <span>ping localhost</span>,
      <span>ping 127.0.0.1</span>,
    ],
    type: 'custom',
  },
};

export const LineNumber: Story = {
  args: {
    start: 10,
    lines: [
      <span>ping localhost</span>,
      <span>ping 127.0.0.1</span>,
    ],
    type: 'lineNo',
  },
};
