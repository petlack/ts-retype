import type { Meta, StoryObj } from '@storybook/react';

import { MultilangWindow } from '~/code/MultilangWindow';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/MultilangWindow',
  component: MultilangWindow,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof MultilangWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    codes: [
      { code: ['npx ts-retype'], lang: 'npm' },
      { code: ['yarn dlx ts-retype'], lang: 'yarn' },
    ],
    theme: 'light',
  },
};

export const Dark: Story = {
  args: {
    codes: [
      { code: ['npx ts-retype'], lang: 'npm' },
      { code: ['yarn dlx ts-retype'], lang: 'yarn' },
    ],
    theme: 'light',
  },
};
