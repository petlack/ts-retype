import { FaMoon, FaSun } from 'react-icons/fa';
import { useTermix } from '~/termix';
import { Button } from '../Button';

export const ThemeToggle = () => {
  const { setColorMode } = useTermix();
  return (
    <>
      <Button colorScheme='black' leftIcon={<FaMoon />} onClick={() => setColorMode('dark')}>Dark</Button>
      <Button colorScheme='white' leftIcon={<FaSun />} onClick={() => setColorMode('light')}>Light</Button>
    </>
  );
};

