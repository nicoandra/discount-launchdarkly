import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import {
  OnUpdateFlagDefaultRulesInterface,
  OnUpdateFlagGlobalsInterface,
  useUpdateFlag,
} from 'hooks/use-update-flag';
import {
  FlagDebugModal,
  FlagUpdateModal,
  FlagTargetingToggleModal,
  FlagEditDefaultRulesModal,
} from './modals';

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
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const {
    onOpen: openToggleFlag,
    isOpen: isOpenToggleFlag,
    onClose: onCloseToggleFlag,
  } = useDisclosure();
  const {
    onOpen: openUpdateFlagGlobals,
    isOpen: isOpenUpdateFlagGlobals,
    onClose: onCloseUpdateFlagGlobals,
  } = useDisclosure();
  const {
    onOpen: openFlagDebug,
    isOpen: isOpenFlagDebug,
    onClose: onCloseFlagDebug,
  } = useDisclosure();
  const {
    onOpen: openUpdateFlagDefaults,
    isOpen: isOpenUpdateFlagDefaults,
    onClose: onCloseUpdateFlagDefaults,
  } = useDisclosure();

  const {
    isUpdatingFlag,
    onToggleFlagTargeting,
    onUpdateFlagGlobals,
    onSetFlagArchived,
    onUpdateFlagDefaultRules,
  } = useUpdateFlag({
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
    [flag],
  );

  const onConfirmUpdateFlagDefaultRules = useCallback(
    async (props: OnUpdateFlagDefaultRulesInterface) => {
      await onUpdateFlagDefaultRules(props);
      refetchFlags();
    },
    [flag],
  );

  const onArchived = useCallback(async () => {
    if (flag.archived) {
      return;
    }

    if (window.confirm('Are you sure you want to *archive* this flag and deactive it?')) {
      await onSetFlagArchived({ value: true, comment: 'Archiving flag' });
      refetchFlags();
    }
  }, []);

  const onUnarchived = useCallback(async () => {
    if (!flag.archived) {
      return;
    }

    if (window.confirm('Are you sure you want to *unarchive* this flag and reactive it?')) {
      await onSetFlagArchived({ value: false, comment: 'Unarchving flag' });
      refetchFlags();
    }
  }, []);

  // Temporarily while switching envs, this key doesn't exist:
  if (!flag.environments[env.key]) {
    return <></>;
  }

  return (
    <Stack
      direction="row"
      borderBottom={isLastItem ? '0px' : '1px'}
      borderColor={borderColor}
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
        isOpen={isOpenUpdateFlagGlobals}
        onCancel={onCloseUpdateFlagGlobals}
        onConfirmUpdateGlobals={onConfirmUpdateGlobals}
        isUpdatingFlag={isUpdatingFlag}
      />
      <FlagEditDefaultRulesModal
        flag={flag}
        isOpen={isOpenUpdateFlagDefaults}
        onCancel={onCloseUpdateFlagDefaults}
        onConfirm={onConfirmUpdateFlagDefaultRules}
        isUpdatingFlag={isUpdatingFlag}
      />
      <FlagDebugModal flag={flag} isOpen={isOpenFlagDebug} onCancel={onCloseFlagDebug} />
      <Box flex={5}>
        <HStack>
          <Text fontSize="md" as="b">
            {flag.name}
          </Text>
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
      <Box flex={1}></Box>
      <HStack flex={2} justifyContent="right">
        <Text>Targeting:</Text>
        <Switch
          size="lg"
          colorScheme="green"
          isChecked={isFlagTargetingOn}
          onChange={openToggleFlag}
        />
        <Box paddingLeft="2">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={openUpdateFlagGlobals}>Edit settings</MenuItem>
              <MenuItem onClick={openUpdateFlagDefaults}>Edit default rules</MenuItem>
              <MenuDivider />
              <MenuItem onClick={openFlagDebug}>Flag debugger</MenuItem>
              <MenuDivider />
              {flag.archived ? (
                <MenuItem color="red" onClick={onUnarchived}>
                  Unarchive flag
                </MenuItem>
              ) : (
                <MenuItem color="red" onClick={onArchived}>
                  Archive flag
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Stack>
  );
};
