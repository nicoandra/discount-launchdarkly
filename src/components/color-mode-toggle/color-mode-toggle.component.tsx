import { Box, Button, Tooltip, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box flex="1" textAlign="right">
      <Tooltip label={colorMode === 'light' ? 'Enable dark mode' : 'Enable light mode'}>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Tooltip>
    </Box>
  );
};
