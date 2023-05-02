import type { Meta, StoryObj } from '@storybook/react';
import { TypeDuplicate } from '@ts-retype/retype';

import { Duplicate } from '../../../../vis/src/components/Duplicate';

import ThemeDecorator from '../ThemeDecorator';

const duplicate: TypeDuplicate = {
  'names': [{ 'name': 'Search', 'count': 2 }],
  'group': 'renamed',
  'parameters': [{ 'name': '{ facets }', 'type': 'SearchProps' }],
  'returnType': '<empty_node>',
  'files': [
    {
      'name': 'Search',
      'type': 'function',
      'src': 'Search({ facets }: SearchProps) => unknown',
      'pos': [2074, 3376],
      'offset': 6,
      'lines': [68, 119],
      'file': 'vis/src/model/search.ts',
      'srcHgl': {
        'type': 'root',
        'children': [
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'function'] },
            'children': [{ 'type': 'text', 'value': 'Search' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '(' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '{' }]
          },
          { 'type': 'text', 'value': ' facets ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '}' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'operator'] },
            'children': [{ 'type': 'text', 'value': ':' }]
          },
          { 'type': 'text', 'value': ' SearchProps' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': ')' }]
          },
          { 'type': 'text', 'value': ' ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'operator'] },
            'children': [{ 'type': 'text', 'value': '=>' }]
          },
          { 'type': 'text', 'value': ' ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'builtin'] },
            'children': [{ 'type': 'text', 'value': 'unknown' }]
          }
        ]
      }
    },
    {
      'name': 'Search',
      'type': 'function',
      'src': 'Search({ query, setQuery }: SearchProps) => unknown',
      'pos': [151, 1001],
      'offset': 6,
      'lines': [9, 30],
      'file': 'vis/src/components/Search/Search.tsx',
      'srcHgl': {
        'type': 'root',
        'children': [
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'function'] },
            'children': [{ 'type': 'text', 'value': 'Search' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '(' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '{' }]
          },
          { 'type': 'text', 'value': ' query' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': ',' }]
          },
          { 'type': 'text', 'value': ' setQuery ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': '}' }]
          },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'operator'] },
            'children': [{ 'type': 'text', 'value': ':' }]
          },
          { 'type': 'text', 'value': ' SearchProps' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'punctuation'] },
            'children': [{ 'type': 'text', 'value': ')' }]
          },
          { 'type': 'text', 'value': ' ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'operator'] },
            'children': [{ 'type': 'text', 'value': '=>' }]
          },
          { 'type': 'text', 'value': ' ' },
          {
            'type': 'element',
            'tagName': 'span',
            'properties': { 'className': ['token', 'builtin'] },
            'children': [{ 'type': 'text', 'value': 'unknown' }]
          }
        ]
      }
    }
  ],
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'uikit/code/Duplicate',
  component:  Duplicate,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof  Duplicate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: duplicate,
};

export const Light: Story = {
  args: duplicate,
};
