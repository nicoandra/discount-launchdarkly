import { useLaunchDarklyApi } from 'hooks/use-launchdarkly-api';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useCallback, useMemo, useState } from 'react';

// https://apidocs.launchdarkly.com/tag/Feature-flags#operation/postFeatureFlag

export interface CreateFlagParams {
  name: string;
  key: string;
  description?: string;
  clientSideAvailability: {
    usingMobileKey: boolean;
    usingEnvironmentId: boolean;
  };
  temporary?: boolean; // default true
  tags?: Array<string>;
  variations: Array<{
    value: boolean | string; // string for multi-variate
    name?: string; // human-readable name of variation
    description?: string;
  }>;
  defaults: {
    // always integer, index of variations array
    onVariation: number;
    offVariation: number;
  };
}

interface UseCreateFlagAPI {
  isCreatingFlag: boolean;
  onCreateFlag: (props: CreateFlagParams) => Promise<FlagItem | null>;
}

export const useCreateFlag = (): UseCreateFlagAPI => {
  const [isCreatingFlag, setIsCreatingFlag] = useState<boolean>(false);
  const { launchDarklyApi } = useLaunchDarklyApi();
  const { projectKey } = useLaunchDarklyConfig();
  const canCreate = useMemo(() => {
    return !!projectKey;
  }, [projectKey]);

  const onCreateFlag = useCallback(
    (params: CreateFlagParams) => {
      if (!canCreate) {
        return Promise.resolve(null);
      }
      setIsCreatingFlag(true);
      const response = launchDarklyApi.fetch<FlagItem>({
        path: `/api/v2/flags/${projectKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      setIsCreatingFlag(false);
      return response;
    },
    [canCreate],
  );

  return {
    isCreatingFlag,
    onCreateFlag,
  };
};
