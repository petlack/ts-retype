import type { Meta, StoryObj } from '@storybook/react';

import { Window } from 'code/Window';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/Window',
  component:  Window,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof  Window>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: 'dark',
    children: <span>ping localhost</span>,
    name: 'window',
  },
};

export const Light: Story = {
  args: {
    theme: 'light',
    children: <span>ping localhost</span>,
    name: 'window',
  },
};
