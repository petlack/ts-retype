import { CSSProperties, Theme, ThemeUIStyleObject } from 'theme-ui';

export type Corners = 'sharp' | 'dull' | 'round' | 'ball' | 'pill';
export type Density = 'airy' | 'gapped' | 'snug' | 'packed';
export type Fill = 'solid' | 'semi' | 'outline' | 'ghost' | 'link';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type Weight = 'thin' | 'regular' | 'bold';
export type Energy = 'rigid' | 'live';
// export type Energy = 'rigid' | 'agile' | 'liquid' | 'fluid' | 'elastic';
export type Mimic = 'static' | 'tint' | 'morph';
export type Speed = 'slow' | 'real' | 'fast';

type TermixComponent = { [k: string]: TermixStyle & TermixProps } & {
  default?: TermixProps & TermixStyle;
};

export type Termix = Theme &
  Partial<{
    tags: TermixComponent;
    buttons: TermixComponent;
    spinners: TermixComponent;
    speeds: Record<string, string>;
    corners: Record<Corners, TermixStyle>;
    density: Record<Density, TermixStyle>;
    fill: Record<Fill, (props: { color: string; colorScheme: string }) => TermixStyle>;
    size: Record<Size, TermixStyle>;
    weight: Record<Weight, TermixStyle>;
    energy: Record<Energy, TermixStyle>;
    mimic: Record<Mimic, (props: { color: string; colorScheme: string }) => TermixStyle>;
    speed?: Record<Speed, TermixStyle>;
  }>;

export type TermixProps = {
  colorScheme?: string;
  variant?: string;
  size?: Size;
  density?: Density;
  fill?: Fill;
  weight?: Weight;
  corners?: Corners;
  energy?: Energy;
  mimic?: Mimic;
  element?: TermixComponent;
  speed?: Speed;
};

export const TermixPropsNames = [
  'colorScheme',
  'variant',
  'size',
  'density',
  'fill',
  'weight',
  'corners',
  'energy',
  'mimic',
  'element',
  'speed',
];

export type TermixStyle = TermixProps &
  ThemeUIStyleObject &
  Pick<CSSProperties, 'fontSize' | 'color'>;
