import type { Meta, StoryObj } from '@storybook/react';

import { WithLineNumbers } from '~/code/WithLineNumbers';
import ThemeDecorator from '../ThemeDecorator';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/WithLineNumbers',
  component: WithLineNumbers,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof WithLineNumbers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    lines: [
      [<span>export default function () {'{'}</span>],
      [<span>{'}'}</span>],
    ],
    start: 10
  },
};
