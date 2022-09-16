import { EnvironmentItem, ListEnvironmentsResponse } from 'hooks/use-list-environments';
import { createContext } from 'react';
import { LaunchDarklyProject } from 'providers/launchdarkly-api/launchdarkly-api';
import { DEFAULT_PROJECT_KEY } from './constants';

export interface LaunchDarklyConfigContextAPI {
  loading: boolean;
  projectKey: LaunchDarklyProject;
  setProjectKey: (projectKey: LaunchDarklyProject) => void;
  env: EnvironmentItem;
  envs: ListEnvironmentsResponse;
  setEnv: (env: EnvironmentItem) => void;
}

export const LaunchDarklyConfigContext = createContext<LaunchDarklyConfigContextAPI>({
  loading: true,
  projectKey: DEFAULT_PROJECT_KEY,
  setProjectKey: () => {},
  env: {} as EnvironmentItem,
  envs: {} as ListEnvironmentsResponse,
  setEnv: () => {},
});
