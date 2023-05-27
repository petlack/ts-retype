import type { Meta, StoryObj } from '@storybook/react';

import { LanguageTab } from '~/code/LanguageTab';
import ThemeDecorator from '../ThemeDecorator';

const meta = {
  title: 'uikit/code/LanguageTab',
  component: LanguageTab,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof LanguageTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lang: 'rust',
    selectedLang: 'ruby',
  },
};

export const Selected: Story = {
  args: {
    lang: 'ruby',
    selectedLang: 'ruby',
  },
};
