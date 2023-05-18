import { Box } from 'theme-ui';

export const Overlay: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ position: 'fixed', zIndex: 100, top: 0, right: 0 }}>
      {children}
    </Box>
  );
};
