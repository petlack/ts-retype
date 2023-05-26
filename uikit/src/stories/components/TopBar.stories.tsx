import type { Meta, StoryObj } from '@storybook/react';
import { Topbar } from '~/layouts/Topbar';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/Topbar',
  component: Topbar,
  decorators: [ThemeDecorator],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [<></>, <></>],
  },
};

