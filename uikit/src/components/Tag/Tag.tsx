import { FC, PropsWithChildren } from 'react';
import { Box, useThemeUI } from 'theme-ui';
import { TermixTheme, Corners, Density, Fill, Size, Weight } from 'theme/theme';

export type TermixProps = {
  color?: string;
  variant?: string;
  size?: Size;
  density?: Density;
  fill?: Fill;
  weight?: Weight;
  corners?: Corners;
}

export const Tag: FC<PropsWithChildren<TermixProps>> = ({
  children,
  color,
  variant = 'default',
  fill = 'solid',
  size = 'md',
  density = 'dense',
  weight = 'regular',
  corners = 'dull',
}) => {
  const context = useThemeUI();
  const theme = context.theme as TermixTheme;
  const variants = [...variant.split('.'), fill, color, size, density, weight, corners];
  const fillStyles = color && theme.fill[fill]({ color }) || {};
  const variantsStyles = [
    ...variants.map(variant => variant && theme.tags[variant] || {}),
    fillStyles,
    theme.weight[weight],
    theme.size[size],
    theme.corners[corners],
    theme.density[density],
  ];
  const mergedStyles = variantsStyles.reduce((res, item) => ({ ...res, ...item }), theme.tags.default);
  return (
    <Box
      sx={{ display: 'inline-flex', ...mergedStyles }}
    >
      {children}
    </Box>
  );
};
