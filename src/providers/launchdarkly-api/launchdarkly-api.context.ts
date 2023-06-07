import { createContext } from 'react';
import { LaunchDarklyApi } from 'providers/launchdarkly-api/launchdarkly-api';

export interface LaunchDarklyApiContextAPI {
  launchDarklyApi: LaunchDarklyApi;
  cognitoUser: any;
}

export const LaunchDarklyApiContext = createContext<LaunchDarklyApiContextAPI>({
  launchDarklyApi: undefined as any,
  cognitoUser: undefined,
});
