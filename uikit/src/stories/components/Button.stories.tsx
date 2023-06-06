import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/components/Button';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/components/Button',
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
    children: 'uikit',
    fill: 'solid',
    sizing: 'md',
    colorScheme: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'uikit',
    fill: 'ghost',
    sizing: 'md',
    colorScheme: 'flamingo',
  },
};

export const Large: Story = {
  args: {
    children: 'uikit',
    fill: 'semi',
    sizing: 'xl',
  },
};

export const Medium: Story = {
  args: {
    children: 'uikit',
    fill: 'outline',
    sizing: 'md',
    colorScheme: 'green',
  },
};
