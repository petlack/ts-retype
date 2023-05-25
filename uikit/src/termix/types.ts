import { Theme, ThemeUIStyleObject } from 'theme-ui';

export type Corners = 'sharp' | 'dull' | 'round' | 'ball' | 'pill';
export type Density = 'airy' | 'dense';
export type Fill = 'solid' | 'semi' | 'outline' | 'ghost' | 'link';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type Weight = 'thin' | 'regular' | 'bold';
export type Energy = 'rigid' | 'live';
// export type Energy = 'rigid' | 'agile' | 'liquid' | 'fluid' | 'elastic';
export type Mimic = 'static' | 'tint' | 'morph';

type TermixComponent = { [k: string]: TermixStyle & TermixProps } & {
  default?: TermixProps & TermixStyle;
};

export type Termix = Theme &
  Partial<{
    tags: TermixComponent;
    buttons: TermixComponent;
    corners: Record<Corners, TermixStyle>;
    density: Record<Density, TermixStyle>;
    fill: Record<Fill, (props: { color: string }) => TermixStyle>;
    size: Record<Size, TermixStyle>;
    weight: Record<Weight, TermixStyle>;
    energy: Record<Energy, TermixStyle>;
    mimic: Record<Mimic, (props: { color: string }) => TermixStyle>;
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
};

export type TermixStyle = ThemeUIStyleObject;
