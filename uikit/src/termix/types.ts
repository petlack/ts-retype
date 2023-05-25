import { Theme, ThemeUIStyleObject } from 'theme-ui';

export type Corners = 'sharp' | 'dull' | 'round' | 'ball' | 'pill';
export type Density = 'airy' | 'dense';
export type Fill = 'solid' | 'semi' | 'outline';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type Weight = 'thin' | 'regular' | 'bold';

export type Termix = Theme &
  Partial<{
    tags: Record<string, ThemeUIStyleObject>;
    corners: Record<Corners, ThemeUIStyleObject>;
    density: Record<Density, ThemeUIStyleObject>;
    fill: Record<Fill, (props: { color: string }) => ThemeUIStyleObject>;
    size: Record<Size, ThemeUIStyleObject>;
    weight: Record<Weight, ThemeUIStyleObject>;
  }>;
