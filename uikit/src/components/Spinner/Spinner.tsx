import { CSSProperties, FC } from 'react';
import { TermixProps, useTermix, useTermixStyle } from '~/termix';
import { Box } from 'theme-ui';
import { Code } from './Code';
import { Comet } from './Comet';
import { Donut } from './Donut';
import { Ellipsis } from './Ellipsis';
import { Grid } from './Grid';
import { Ring } from './Ring';
import { Ripple } from './Ripple';
import { StyledComponent } from '../types';

export type SpinnerProps = TermixProps & {
  flavor: 'code' | 'comet' | 'donut' | 'ellipsis' | 'grid' | 'ring' | 'ripple',
};

export const Spinner: FC<StyledComponent<SpinnerProps>> = ({ flavor, sx, ...termixProps }) => {
  const Animation = {
    grid: Grid,
    ellipsis: Ellipsis,
    ring: Ring,
    code: Code,
    comet: Comet,
    donut: Donut,
    ripple: Ripple,
  }[flavor] as FC;
  const { theme } = useTermix();
  const style = useTermixStyle(theme, { ...termixProps, element: theme.spinners });
  const cssProps: CSSProperties = {
    '--size-spinner': '1em',
    '--clr-dot': 'currentColor',
    '--clr-muted': theme.colors?.primary,
    '--duration': theme.speeds?.[style.speed || 'slow'],
  } as CSSProperties;

  const mergedStyle = {
    ...cssProps,
    ...style,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    ...sx,
  };
  return <Box className='spinner' sx={mergedStyle}><Animation /></Box>;
};
