import { useContext } from 'react';
import {
  LaunchDarklyConfigContext,
  LaunchDarklyConfigContextAPI,
} from 'providers/launchdarkly-config/launchdarkly-config.context';

export const useLaunchDarklyConfig = (): LaunchDarklyConfigContextAPI => {
  return useContext(LaunchDarklyConfigContext);
};
