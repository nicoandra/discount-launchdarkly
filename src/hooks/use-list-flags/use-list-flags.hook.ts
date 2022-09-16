import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';
import { DEFAULT_PROJECT_KEY } from 'providers/launchdarkly-config/constants';
import { FlagItem } from './types';

export interface ListFlagsResponse {
  totalCount: number; // 1205
  items: Array<FlagItem>;
}

interface UseFlagsInterface {
  env: string | null;
  projectKey?: string;
  archived?: boolean;
}
export const useListFlags = ({
  env,
  projectKey = DEFAULT_PROJECT_KEY,
  archived,
}: UseFlagsInterface): UseLdGetAPI<ListFlagsResponse> => {
  // https://apidocs.launchdarkly.com/tag/Feature-flags#operation/getFeatureFlags
  return useLdGet<ListFlagsResponse>(
    {
      skip: !env, // Don't do request until env is loaded
      path: `/api/v2/flags/${projectKey}`,
      method: 'GET',
      query: {
        env: env ?? '',
        summary: 'false', // Include all rules/targeting
        archived: (archived ?? false).toString(),
      },
    },
    [projectKey, env, archived],
  );
};
