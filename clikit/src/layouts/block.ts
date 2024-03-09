import { Styles } from '../components/styles.js';

export type BoxProps = Styles & {
  top: number;
  bottom: number;
  left: number;
  right: number;
  backgroundColor: string;
  color: string;
};

function findTrueValue(obj: any) {
  return Object.entries(obj)
    .filter(([, v]) => !!v)
    .at(0)?.[0];
}

export type StyledProps = Pick<Styles, 'width' | 'height'>;

export type UnstyledProps = {
  debug?: boolean;
  nice?: boolean;
  airy?: boolean;
  grow?: boolean;
  center?: boolean;
  bg?: boolean;
  gray?: boolean;
  green?: boolean;
  red?: boolean;
  yellow?: boolean;
  blue?: boolean;
  white?: boolean;
  black?: boolean;
  color?: string;
  bold?: boolean;
  padding?: number;
  px?: number;
  py?: number;
};

export function applyStyle(unstyledProps: UnstyledProps & StyledProps): Partial<BoxProps> {
  const {
    debug,
    nice,
    airy,
    grow,
    center,
    bg,
    white,
    green,
    yellow,
    blue,
    red,
    black,
    color,
    padding,
    px,
    py,
    ...styledProps
  } = unstyledProps;
  const colorFromFlags = findTrueValue({ white, green, yellow, blue, red, black });
  const resolvedColor = color || colorFromFlags;
  return {
    borderStyle: debug ? 'single' : undefined,
    borderColor: debug ? 'red' : undefined,
    gap: nice ? 1 : 0,
    flexGrow: grow ? 1 : 0,
    padding,
    paddingLeft: padding ? padding : px ? px : airy ? 2 : nice ? 1 : 0,
    paddingRight: padding ? padding : px ? px : airy ? 2 : nice ? 1 : 0,
    paddingTop: padding ? padding : py ? py : airy ? 1 : 0,
    paddingBottom: padding ? padding : py ? py : airy ? 1 : 0,
    alignItems: center ? 'center' : undefined,
    justifyContent: center ? 'center' : undefined,
    color: bg ? undefined : resolvedColor,
    backgroundColor: bg ? resolvedColor : undefined,
    ...styledProps,
  };
}
