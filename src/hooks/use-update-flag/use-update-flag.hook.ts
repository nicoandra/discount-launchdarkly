import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useCallback, useMemo, useState } from 'react';
import { launchDarklyApi } from 'utils/launchdarkly-api';

// https://apidocs.launchdarkly.com/tag/Feature-flags#operation/patchFeatureFlag

interface OnToggleFlagTargetingInterface {
  instruction: 'turnFlagOff' | 'turnFlagOn';
  comment: string;
}

interface OnUpdateFlagMetadataInterface {
  name: string;
  description: string;
}

interface OnUpdateFlagClientSideAvailabilityInterface {
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
  onUpdateFlagMetadata: (props: OnUpdateFlagMetadataInterface) => Promise<FlagItem | null>;
  onUpdateFlagClientSideAvailability: (
    props: OnUpdateFlagClientSideAvailabilityInterface,
  ) => Promise<FlagItem | null>;
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

  const onUpdateFlagMetadata = useCallback(
    ({ name, description }: OnUpdateFlagMetadataInterface) => {
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
        ],
      });
      setIsUpdatingFlag(false);
      return response;
    },
    [canUpdate, env],
  );

  const onUpdateFlagClientSideAvailability = useCallback(
    ({
      usingMobileKey,
      usingEnvironmentId,
      comment,
    }: OnUpdateFlagClientSideAvailabilityInterface) => {
      if (!canUpdate) {
        return Promise.resolve(null);
      }
      setIsUpdatingFlag(true);
      const response = launchDarklyApi.patchFlag({
        projectKey,
        flagKey,
        comment,
        operations: [
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
    onUpdateFlagMetadata,
    onUpdateFlagClientSideAvailability,
  };
};
