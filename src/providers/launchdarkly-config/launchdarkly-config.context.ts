import { EnvironmentItem, ListEnvironmentsResponse } from 'hooks/use-list-environments';
import { createContext } from 'react';
import { AccessTokenItem } from 'hooks/use-list-access-tokens';
import { ProjectItem } from 'hooks/use-list-projects';

export interface LaunchDarklyConfigContextAPI {
  loading: boolean;
  projects: Array<ProjectItem>;
  projectKey: string;
  setProjectKey: (projectKey: string) => void;
  env: EnvironmentItem;
  envs: ListEnvironmentsResponse;
  setEnv: (env: EnvironmentItem) => void;
  accessToken: AccessTokenItem | null;
}

export const LaunchDarklyConfigContext = createContext<LaunchDarklyConfigContextAPI>({
  loading: true,
  projects: [],
  projectKey: '',
  setProjectKey: () => {},
  env: {} as EnvironmentItem,
  envs: {} as ListEnvironmentsResponse,
  setEnv: () => {},
  accessToken: null,
});
