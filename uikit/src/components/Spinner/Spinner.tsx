import { CSSProperties, FC } from 'react';
import { TermixProps, useTermix, useTermixStyle } from 'termix';
import { Box } from 'theme-ui';
import { Code } from './Code';
import { Comet } from './Comet';
import { Donut } from './Donut';
import { Ellipsis } from './Ellipsis';
import { Grid } from './Grid';
import { Ring } from './Ring';
import { Ripple } from './Ripple';

export type SpinnerProps = TermixProps & {
  flavor: 'code' | 'comet' | 'donut' | 'ellipsis' | 'grid' | 'ring' | 'ripple',
};

export const Spinner: FC<SpinnerProps> = ({ flavor, ...termixProps }) => {
  const Animation = {
    grid: Grid,
    ellipsis: Ellipsis,
    ring: Ring,
    code: Code,
    comet: Comet,
    donut: Donut,
    ripple: Ripple,
  }[flavor] as FC;
  const theme = useTermix();
  const size = 42;
  const style = useTermixStyle(theme, { ...termixProps, element: theme.spinners });
  const cssProps: CSSProperties = {
    '--size-spinner': `${size}px`,
    '--clr-dot': style.color,
    '--clr-muted': theme.colors?.surface1,
    '--duration': theme.speeds?.[style.speed || 'slow'],
  } as CSSProperties;

  const mergedStyle = {
    ...cssProps,
    ...style,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  };
  return <Box className='spinner' sx={mergedStyle}><Animation /></Box>;
};
