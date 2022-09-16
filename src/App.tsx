import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import { DashboardScreen } from 'screens/dashboard';
import { LaunchDarklyConfigProvider } from 'providers/launchdarkly-config';
import { EnforceApiKeyPresenceProvider } from 'providers/enforce-api-key-presence';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <EnforceApiKeyPresenceProvider>
        <LaunchDarklyConfigProvider>
          <DashboardScreen />
        </LaunchDarklyConfigProvider>
      </EnforceApiKeyPresenceProvider>
    </ChakraProvider>
  );
};
