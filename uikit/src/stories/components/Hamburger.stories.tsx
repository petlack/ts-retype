import type { Meta, StoryObj } from '@storybook/react';
import { Hamburger } from '~/components/Hamburger';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/components/Hamburger',
  component: Hamburger,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
} satisfies Meta<typeof Hamburger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    flavor: 'cross',
  },
};

