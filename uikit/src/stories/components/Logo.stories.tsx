import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from '~/components/Logo';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/Logo',
  component: Logo,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'test',
  },
};

