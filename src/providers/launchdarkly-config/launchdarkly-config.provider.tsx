import React, { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import {
  EnvironmentItem,
  ListEnvironmentsResponse,
  useListEnvironments,
} from 'hooks/use-list-environments';
import { LaunchDarklyProject } from 'providers/launchdarkly-api/launchdarkly-api';
import { LaunchDarklyConfigContext } from './launchdarkly-config.context';
import { useListAccessTokens } from 'hooks/use-list-access-tokens';
import { useLaunchDarklyApi } from 'hooks/use-launchdarkly-api';

interface LaunchDarklyConfigProviderProps {
  children: ReactNode;
}
export const LaunchDarklyConfigProvider = ({ children }: LaunchDarklyConfigProviderProps) => {
  const { apiKey } = useLaunchDarklyApi();
  const [projectKey, setProjectKey] = useState<LaunchDarklyProject>(LaunchDarklyProject.DEFAULT);
  const [env, setEnv] = useState<EnvironmentItem | null>(null);

  const onSetProjectKey = useCallback(
    (newProjectKey: LaunchDarklyProject) => {
      // important: reset env sot that it doesn't trigger requests to the wrong env:
      setEnv(null);
      setProjectKey(newProjectKey);
    },
    [setProjectKey],
  );

  const { loading: loadingEnvironments, response: environments } = useListEnvironments({
    projectKey,
  });

  const { loading: loadingAccessTokens, response: accessTokens } = useListAccessTokens();

  useEffect(() => {
    if (environments?.items?.length) {
      setEnv(environments.items[0]);
    }
  }, [environments]);

  const accessToken = useMemo(() => {
    if (!accessTokens || !apiKey) {
      return null;
    }
    return accessTokens.items.find((token) => apiKey.endsWith(token.token)) ?? null;
  }, [apiKey, accessTokens]);

  const loading =
    loadingEnvironments || loadingAccessTokens || !accessToken || !env || !environments;

  return (
    <LaunchDarklyConfigContext.Provider
      value={{
        loading,
        projectKey,
        setProjectKey: onSetProjectKey,
        env: env as EnvironmentItem,
        envs: environments as ListEnvironmentsResponse,
        setEnv,
        accessToken,
      }}
    >
      {loading ? (
        <Center minH="300" justifyContent={'center'}>
          <Spinner />
        </Center>
      ) : (
        children
      )}
    </LaunchDarklyConfigContext.Provider>
  );
};
