import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '~/components/Spinner';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/components/Spinner',
  component: Spinner,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    flavor: 'grid',
  },
};

