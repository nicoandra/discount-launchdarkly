import { createContext } from 'react';
import { LaunchDarklyApi } from 'providers/launchdarkly-api/launchdarkly-api';

export interface LaunchDarklyApiContextAPI {
  apiKey: string | undefined;
  launchDarklyApi: LaunchDarklyApi;
  cognitoUser: any;
}

export const LaunchDarklyApiContext = createContext<LaunchDarklyApiContextAPI>({
  apiKey: undefined,
  launchDarklyApi: undefined as any,
  cognitoUser: undefined,
});
