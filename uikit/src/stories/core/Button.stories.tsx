import type { Meta, StoryObj } from '@storybook/react';

import { Button } from 'core/Button';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/core/Button',
  component: Button,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    caption: 'uikit',
    kind: 'button',
    size: 'md',
    style: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    caption: 'uikit',
    kind: 'button',
    size: 'md',
    style: 'secondary',
  },
};

export const Large: Story = {
  args: {
    caption: 'uikit',
    kind: 'button',
    size: 'xl',
    style: 'primary',
  },
};

export const Medium: Story = {
  args: {
    caption: 'uikit',
    kind: 'button',
    size: 'md',
    style: 'primary',
  },
};
