import React, { useState, ReactNode, useEffect, useCallback } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import {
  EnvironmentItem,
  ListEnvironmentsResponse,
  useListEnvironments,
} from 'hooks/use-list-environments';
import { LaunchDarklyProject } from 'utils/launchdarkly-api';
import { LaunchDarklyConfigContext } from './launchdarkly-config.context';

interface LaunchDarklyConfigProviderProps {
  children: ReactNode;
}
export const LaunchDarklyConfigProvider = ({ children }: LaunchDarklyConfigProviderProps) => {
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

  useEffect(() => {
    if (environments?.items?.length) {
      setEnv(environments.items[0]);
    }
  }, [environments]);

  const loading = loadingEnvironments || !env || !environments;

  return (
    <LaunchDarklyConfigContext.Provider
      value={{
        loading,
        projectKey,
        setProjectKey: onSetProjectKey,
        env: env as EnvironmentItem,
        envs: environments as ListEnvironmentsResponse,
        setEnv,
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
