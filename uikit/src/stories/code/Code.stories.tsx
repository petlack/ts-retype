import type { Meta, StoryObj } from '@storybook/react';

import { Code } from '~/code/Code';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/code/Code',
  component: Code,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <>{'hello world'}</>,
  },
};
