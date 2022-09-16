import { createContext } from 'react';
import { LaunchDarklyApi } from 'utils/launchdarkly-api';

export interface LaunchDarklyApiContextAPI {
  apiKey: string | undefined;
  launchDarklyApi: LaunchDarklyApi;
}

export const LaunchDarklyApiContext = createContext<LaunchDarklyApiContextAPI>({
  apiKey: undefined,
  launchDarklyApi: undefined as any,
});
