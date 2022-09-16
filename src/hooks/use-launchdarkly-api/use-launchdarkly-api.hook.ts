import { useContext } from 'react';
import {
  LaunchDarklyApiContext,
  LaunchDarklyApiContextAPI,
} from 'providers/launchdarkly-api/launchdarkly-api.context';

export const useLaunchDarklyApi = (): LaunchDarklyApiContextAPI => {
  return useContext(LaunchDarklyApiContext);
};
