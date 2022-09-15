import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';
import { useCallback, useMemo, useState } from 'react';
import { launchDarklyApi, LaunchDarklyProject } from 'utils/launchdarkly-api';

// https://apidocs.launchdarkly.com/tag/Feature-flags#operation/patchFeatureFlag

interface OnToggleFlagTargetingInterface {
  flagKey: string;
  instruction: 'turnFlagOff' | 'turnFlagOn';
  comment: string;
}
interface UseUpdateFlagAPI {
  isUpdatingFlag: boolean;
  onToggleFlagTargeting: (props: OnToggleFlagTargetingInterface) => Promise<unknown>;
}

export const useUpdateFlag = (): UseUpdateFlagAPI => {
  const [isUpdatingFlag, setIsUpdatingFlag] = useState<boolean>(false);
  const { projectKey, env } = useLaunchDarklyConfig();
  const canUpdate = useMemo(() => {
    return !!env && !!projectKey;
  }, [env, projectKey]);

  const onToggleFlagTargeting = useCallback(
    ({ instruction, comment, flagKey }: OnToggleFlagTargetingInterface) => {
      if (!canUpdate) {
        return Promise.resolve();
      }
      setIsUpdatingFlag(true);

      const response = launchDarklyApi.fetch<unknown>({
        path: `/api/v2/flags/${projectKey}/${flagKey}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
        },
        body: JSON.stringify({
          environmentKey: env.key,
          instructions: [{ kind: instruction }],
          comment,
        }),
      });
      setIsUpdatingFlag(false);
      return response;
    },
    [canUpdate, env],
  );

  return { isUpdatingFlag, onToggleFlagTargeting };
};
