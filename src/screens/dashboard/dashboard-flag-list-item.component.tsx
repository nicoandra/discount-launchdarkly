import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Link,
  Stack,
  Switch,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { OnUpdateFlagGlobalsInterface, useUpdateFlag } from 'hooks/use-update-flag';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { FlagTargetingToggleModal } from './flag-targeting-toggle.modal';
import { FlagUpdateModal } from './flag-update.modal';

interface DashboardFlagListItemInterface {
  flag: FlagItem;
  setFilter: (newFilter: string) => void;
  isLastItem: boolean;
  refetchFlags: () => Promise<void>;
}
export const DashboardFlagListItem = ({
  flag,
  setFilter,
  isLastItem,
  refetchFlags,
}: DashboardFlagListItemInterface) => {
  const { env } = useLaunchDarklyConfig();
  const {
    onOpen: openToggleFlag,
    isOpen: isOpenToggleFlag,
    onClose: onCloseToggleFlag,
  } = useDisclosure();
  const {
    onOpen: openUpdateFlag,
    isOpen: isOpenUpdateFlag,
    onClose: onCloseUpdateFlag,
  } = useDisclosure();
  const { isUpdatingFlag, onToggleFlagTargeting, onUpdateFlagGlobals } = useUpdateFlag({
    flagKey: flag.key,
  });

  const { creationDateFormatted, creationDateRelative } = useMemo(() => {
    const creationDateMoment = moment(flag.creationDate);
    return {
      creationDateFormatted: creationDateMoment.format(),
      creationDateRelative: creationDateMoment.fromNow(),
    };
  }, [flag.creationDate]);

  const copyKeyOnClick = useCallback(() => {
    navigator.clipboard.writeText(flag.key);
  }, [flag.key]);

  const isFlagTargetingOn = useMemo(() => {
    return flag.environments[env.key]?.on;
  }, [flag, env]);

  const onConfirmToggleFlag = useCallback(
    async ({ comment }: { comment: string }) => {
      const instruction = isFlagTargetingOn ? 'turnFlagOff' : 'turnFlagOn';
      console.log('Toggle flag targeting', flag.key, { instruction, comment });
      await onToggleFlagTargeting({
        instruction,
        comment,
      });
      refetchFlags();
    },
    [flag, isFlagTargetingOn],
  );

  const onConfirmUpdateGlobals = useCallback(
    async (props: OnUpdateFlagGlobalsInterface) => {
      await onUpdateFlagGlobals(props);
      refetchFlags();
    },
    [flag, isFlagTargetingOn],
  );

  // Temporarily while switching envs, this key doesn't exist:
  if (!flag.environments[env.key]) {
    return <></>;
  }

  return (
    <Stack
      direction="row"
      borderBottom={isLastItem ? '0px' : '1px'}
      borderColor="gray.600"
      paddingBottom="3"
      paddingTop="3"
    >
      <FlagTargetingToggleModal
        flag={flag}
        isFlagTargetingOn={isFlagTargetingOn}
        isOpen={isOpenToggleFlag}
        onCancel={onCloseToggleFlag}
        onConfirm={onConfirmToggleFlag}
        isUpdatingFlag={isUpdatingFlag}
      />
      <FlagUpdateModal
        flag={flag}
        isOpen={isOpenUpdateFlag}
        onCancel={onCloseUpdateFlag}
        onConfirmUpdateGlobals={onConfirmUpdateGlobals}
        isUpdatingFlag={isUpdatingFlag}
      />
      <Box flex={3}>
        <HStack>
          <Link color="blue.400" onClick={openUpdateFlag}>
            <Text fontSize="md" as="b">
              {flag.name}
            </Text>
          </Link>
          <Tooltip label={creationDateFormatted}>
            <Text fontSize="xs" color="gray">
              Created {creationDateRelative}
            </Text>
          </Tooltip>
        </HStack>
        <Button marginTop="1" colorScheme="gray" size="xs" onClick={copyKeyOnClick}>
          {flag.key}
          <CopyIcon marginLeft="2" />
        </Button>
        <Box marginTop="1">
          <Text fontSize="sm">{flag.description}</Text>
        </Box>
        {flag.tags?.length ? (
          <Box marginTop="1">
            {flag.tags.map((tag) => {
              return (
                <Tag
                  size="sm"
                  variant="outline"
                  marginRight="2"
                  key={`${flag.key}-${tag}`}
                  onClick={() => setFilter(tag)}
                  cursor="pointer"
                >
                  {tag}
                </Tag>
              );
            })}
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <VStack flex={1} justifyContent="center">
        <Switch
          size="lg"
          colorScheme="green"
          isChecked={isFlagTargetingOn}
          onChange={openToggleFlag}
        />
      </VStack>
    </Stack>
  );
};
