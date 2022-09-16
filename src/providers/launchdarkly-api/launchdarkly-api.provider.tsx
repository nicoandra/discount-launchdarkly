import React, { ReactNode, useMemo } from 'react';
import { Center, Code, Container, Text } from '@chakra-ui/react';
import { LaunchDarklyApiContext } from './launchdarkly-api.context';
import { LaunchDarklyApi } from 'providers/launchdarkly-api/launchdarkly-api';

interface LaunchDarklyApiProviderProps {
  children: ReactNode;
}
export const LaunchDarklyApiProvider = ({ children }: LaunchDarklyApiProviderProps) => {
  // Consider letting user specify in localStorage/etc
  const apiKey = process.env.REACT_APP_LAUNCHDARKLY_API_KEY;
  const launchDarklyApi = useMemo(() => {
    return new LaunchDarklyApi({ apiKey: apiKey as string });
  }, [apiKey]);
  return (
    <LaunchDarklyApiContext.Provider
      value={{
        apiKey,
        launchDarklyApi,
      }}
    >
      {apiKey ? (
        children
      ) : (
        <Container>
          <Center minH="300" justifyContent={'center'}>
            <Text size="lg">
              Error: When running this locally, you must specify{' '}
              <Code>REACT_APP_LAUNCHDARKLY_API_KEY</Code> in your <Code>.env</Code> file in the root
              directory of this project. See 1Password for this value.
            </Text>
          </Center>
        </Container>
      )}
    </LaunchDarklyApiContext.Provider>
  );
};
