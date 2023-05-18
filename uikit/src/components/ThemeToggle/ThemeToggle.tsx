import { useTheme } from 'theme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={(e) => {
        setTheme(theme);
      }}
    >
      Toggle
    </button>
  );
};
