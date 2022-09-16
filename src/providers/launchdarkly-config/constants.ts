import { LaunchDarklyProject } from 'providers/launchdarkly-api/launchdarkly-api';

export const DEFAULT_PROJECT_KEY = LaunchDarklyProject.DEFAULT;

export enum AccessTokenPermission {
  READER = 'reader',
  WRITER = 'writer',
  OTHER = 'other',
}
