import { useLaunchDarklyApi } from 'hooks/use-launchdarkly-api';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useCallback, useMemo, useState } from 'react';

// https://apidocs.launchdarkly.com/tag/Feature-flags#operation/patchFeatureFlag

interface OnToggleFlagTargetingInterface {
  instruction: 'turnFlagOff' | 'turnFlagOn';
  comment: string;
}

export interface OnUpdateFlagGlobalsInterface {
  name: string;
  description: string;
  usingMobileKey: boolean;
  usingEnvironmentId: boolean;
  comment: string;
}

interface OnSetFlagArchivedInterface {
  value: boolean;
  comment: string;
}

interface UseUpdateFlagAPI {
  isUpdatingFlag: boolean;
  onToggleFlagTargeting: (props: OnToggleFlagTargetingInterface) => Promise<FlagItem | null>;
  onUpdateFlagGlobals: (props: OnUpdateFlagGlobalsInterface) => Promise<FlagItem | null>;
  onSetFlagArchived: (props: OnSetFlagArchivedInterface) => Promise<FlagItem | null>;
}

export const useUpdateFlag = ({ flagKey }: { flagKey: string }): UseUpdateFlagAPI => {
  const [isUpdatingFlag, setIsUpdatingFlag] = useState<boolean>(false);
  const { launchDarklyApi } = useLaunchDarklyApi();
  const { projectKey, env } = useLaunchDarklyConfig();
  const canUpdate = useMemo(() => {
    return !!env && !!projectKey;
  }, [env, projectKey]);

  const onToggleFlagTargeting = useCallback(
    ({ instruction, comment }: OnToggleFlagTargetingInterface) => {
      if (!canUpdate) {
        return Promise.resolve(null);
      }
      setIsUpdatingFlag(true);
      const response = launchDarklyApi.semanticPatchFlag({
        projectKey,
        flagKey,
        environmentKey: env.key,
        instructions: [{ kind: instruction }],
        comment,
      });
      setIsUpdatingFlag(false);
      return response;
    },
    [canUpdate, env],
  );

  const onUpdateFlagGlobals = useCallback(
    ({ name, description, usingMobileKey, usingEnvironmentId }: OnUpdateFlagGlobalsInterface) => {
      if (!canUpdate) {
        return Promise.resolve(null);
      }
      setIsUpdatingFlag(true);
      const response = launchDarklyApi.patchFlag({
        projectKey,
        flagKey,
        comment: 'Updating name / description',
        operations: [
          { op: 'replace', path: '/name', value: name },
          { op: 'replace', path: '/description', value: description },
          { op: 'replace', path: '/clientSideAvailability/usingMobileKey', value: usingMobileKey },
          {
            op: 'replace',
            path: '/clientSideAvailability/usingEnvironmentId',
            value: usingEnvironmentId,
          },
        ],
      });
      setIsUpdatingFlag(false);
      return response;
    },
    [canUpdate, env],
  );

  const onSetFlagArchived = useCallback(
    ({ value, comment }: OnSetFlagArchivedInterface) => {
      if (!canUpdate) {
        return Promise.resolve(null);
      }
      setIsUpdatingFlag(true);
      const response = launchDarklyApi.patchFlag({
        projectKey,
        flagKey,
        comment,
        operations: [{ op: 'replace', path: '/archived', value }],
      });
      setIsUpdatingFlag(false);
      return response;
    },
    [canUpdate, env],
  );

  return {
    isUpdatingFlag,
    onToggleFlagTargeting,
    onUpdateFlagGlobals,
    onSetFlagArchived,
  };
};
