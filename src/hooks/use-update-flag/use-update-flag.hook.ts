import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useCallback, useMemo, useState } from 'react';
import { launchDarklyApi } from 'utils/launchdarkly-api';

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

interface OnArchiveFlagInterface {
  comment: string;
}

interface UseUpdateFlagAPI {
  isUpdatingFlag: boolean;
  onToggleFlagTargeting: (props: OnToggleFlagTargetingInterface) => Promise<FlagItem | null>;
  onUpdateFlagGlobals: (props: OnUpdateFlagGlobalsInterface) => Promise<FlagItem | null>;
  // onArchiveFlag: (props: OnArchiveFlagInterface) => Promise<FlagItem | null>;
}

export const useUpdateFlag = ({ flagKey }: { flagKey: string }): UseUpdateFlagAPI => {
  const [isUpdatingFlag, setIsUpdatingFlag] = useState<boolean>(false);
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

  // const onArchiveFlag = useCallback(
  //   ({
  //     comment,
  //   }: OnArchiveFlagInterface) => {
  //     if (!canUpdate) {
  //       return Promise.resolve(null);
  //     }
  //     setIsUpdatingFlag(true);
  //     const response = launchDarklyApi.semanticPatchFlag({
  //       projectKey,
  //       flagKey,
  //       comment,
  //       operations: [
  //         { op: 'archiveFlag', path: '/clientSideAvailability/usingMobileKey', value: usingMobileKey },
  //         {
  //           op: 'replace',
  //           path: '/clientSideAvailability/usingEnvironmentId',
  //           value: usingEnvironmentId,
  //         },
  //       ],
  //     });
  //     setIsUpdatingFlag(false);
  //     return response;
  //   },
  //   [canUpdate, env],
  // );

  return {
    isUpdatingFlag,
    onToggleFlagTargeting,
    onUpdateFlagGlobals,
  };
};
