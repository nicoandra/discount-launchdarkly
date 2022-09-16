import React, { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import {
  EnvironmentItem,
  ListEnvironmentsResponse,
  useListEnvironments,
} from 'hooks/use-list-environments';
import { LaunchDarklyConfigContext } from './launchdarkly-config.context';
import { useListAccessTokens } from 'hooks/use-list-access-tokens';
import { useLaunchDarklyApi } from 'hooks/use-launchdarkly-api';
import { DEFAULT_PROJECT_KEY } from './constants';
import { useListProjects } from 'hooks/use-list-projects';

interface LaunchDarklyConfigProviderProps {
  children: ReactNode;
}
export const LaunchDarklyConfigProvider = ({ children }: LaunchDarklyConfigProviderProps) => {
  const { apiKey } = useLaunchDarklyApi();
  const [projectKey, setProjectKey] = useState<string>(DEFAULT_PROJECT_KEY);
  const [env, setEnv] = useState<EnvironmentItem | null>(null);

  const onSetProjectKey = useCallback(
    (newProjectKey: string) => {
      // important: reset env sot that it doesn't trigger requests to the wrong env:
      setEnv(null);
      setProjectKey(newProjectKey);
    },
    [setProjectKey],
  );

  const { loading: loadingProjects, response: projects } = useListProjects();

  const { loading: loadingEnvironments, response: environments } = useListEnvironments({
    projectKey,
  });

  const { loading: loadingAccessTokens, response: accessTokens } = useListAccessTokens();

  useEffect(() => {
    if (projects?.items?.length) {
      const defaultProject =
        projects.items.find((project) => project.key === DEFAULT_PROJECT_KEY) ?? projects.items[0];
      setProjectKey(defaultProject.key);
    }
  }, [projects]);

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
    loadingProjects ||
    loadingEnvironments ||
    loadingAccessTokens ||
    !accessToken ||
    !env ||
    !environments;

  return (
    <LaunchDarklyConfigContext.Provider
      value={{
        loading,
        projectKey,
        setProjectKey: onSetProjectKey,
        projects: projects?.items ?? [],
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
