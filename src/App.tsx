import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Button, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import { DashboardScreen } from 'components/dashboard';
import { SegmentsScreen } from 'components/segments';
import { LaunchDarklyApiProvider } from 'providers/launchdarkly-api';
import { LaunchDarklyConfigProvider } from 'providers/launchdarkly-config';
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface Props {
  signOut: CallableFunction;
  // any props that come into the component
}

const Application: React.FC<WithAuthenticatorProps> = (props) => {
  const { user, signOut } = props;

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Button onClick={signOut}>{user?.attributes?.email} log out</Button>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <LaunchDarklyApiProvider>
          <LaunchDarklyConfigProvider>
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/segments" element={<SegmentsScreen />} />
            </Routes>
          </LaunchDarklyConfigProvider>
        </LaunchDarklyApiProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default withAuthenticator(Application);
