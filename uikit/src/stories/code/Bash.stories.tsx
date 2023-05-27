import type { Meta, StoryObj } from '@storybook/react';

import { Bash } from '~/code/Bash';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/Bash',
  component: Bash,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof Bash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: 'dark',
    children: 'ping localhost',
  },
};

export const Light: Story = {
  args: {
    theme: 'light',
    children: 'ping localhost',
  },
};
