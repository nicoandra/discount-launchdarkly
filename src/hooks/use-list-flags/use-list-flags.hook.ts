import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';
import { LaunchDarklyProject } from 'utils/launchdarkly-api';
import { FlagItem } from './types';

export interface ListFlagsResponse {
  totalCount: number; // 1205
  items: Array<FlagItem>;
}

interface UseFlagsInterface {
  env: string | null;
  projectKey?: LaunchDarklyProject;
}
export const useListFlags = ({
  env,
  projectKey = LaunchDarklyProject.DEFAULT,
}: UseFlagsInterface): UseLdGetAPI<ListFlagsResponse> => {
  // https://apidocs.launchdarkly.com/tag/Feature-flags#operation/getFeatureFlags
  return useLdGet<ListFlagsResponse>(
    {
      skip: !env, // Don't do request until env is loaded
      path: `/api/v2/flags/${projectKey}`,
      method: 'GET',
      query: {
        env: env ?? '',
        summary: '1',
      },
    },
    [projectKey, env],
  );
};
