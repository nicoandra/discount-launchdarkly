import React, { ReactNode } from 'react';
import { Center, Code, Container, Spinner, Text } from '@chakra-ui/react';
import { EnforceApiKeyPresenceContext } from './enforce-api-key-presence.context';

interface EnforceApiKeyPresenceProviderProps {
  children: ReactNode;
}
export const EnforceApiKeyPresenceProvider = ({ children }: EnforceApiKeyPresenceProviderProps) => {
  // Consider letting user specify in localStorage/etc
  const apiKey = process.env.REACT_APP_LAUNCHDARKLY_API_KEY;
  return (
    <EnforceApiKeyPresenceContext.Provider
      value={{
        apiKey,
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
    </EnforceApiKeyPresenceContext.Provider>
  );
};
