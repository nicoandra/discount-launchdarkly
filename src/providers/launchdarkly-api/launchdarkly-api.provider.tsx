import React, { ReactNode, useMemo, useEffect, useState } from 'react';
import { Center, Code, Container, Link, Text } from '@chakra-ui/react';
import { LaunchDarklyApiContext } from './launchdarkly-api.context';
import { LaunchDarklyApi } from 'providers/launchdarkly-api/launchdarkly-api';
import { Auth } from 'aws-amplify';

interface LaunchDarklyApiProviderProps {
  children: ReactNode;
}
export const LaunchDarklyApiProvider = ({ children }: LaunchDarklyApiProviderProps) => {
  // Consider letting user specify in localStorage/etc
  const apiKey = "something";

  const [cognitoUser, setCognitoUser] = useState(false);

  useEffect(() => {
    if (cognitoUser) return;
    Auth.currentAuthenticatedUser().then((r) => {
      setCognitoUser(r);
      console.log(r);
    });
  }, [cognitoUser]);

  const launchDarklyApi = useMemo(() => {
    return new LaunchDarklyApi({ cognitoUser });
  }, [cognitoUser]);
  return (
    <LaunchDarklyApiContext.Provider
      value={{
        launchDarklyApi,
        cognitoUser,
      }}
    >
      {apiKey ? (
        children
      ) : (
        <Container>
          <Center minH="300" justifyContent={'center'}>
            <Text size="lg">
              Error: When running this locally, you must specify{' '}
              <Code>REACT_APP_LAUNCHDARKLY_ACCESS_TOKEN</Code> in your <Code>.env</Code> file in the
              root directory of this project. You can{' '}
              <Link
                href="https://app.launchdarkly.com/settings/authorization"
                isExternal
                color="blue.500"
              >
                manage access tokens here
              </Link>
              .
            </Text>
            <Text>User is: {JSON.stringify(cognitoUser)}</Text>
          </Center>
        </Container>
      )}
    </LaunchDarklyApiContext.Provider>
  );
};
