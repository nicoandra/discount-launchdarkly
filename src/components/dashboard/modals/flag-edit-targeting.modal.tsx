// {"comment":"testing","environmentKey":"development","instructions":[{"kind":"addUserTargets","values":["user-123"],"variationId":"b17545b3-4478-4acb-a9c0-9b6abd0e5ed0"}]}

import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  UnorderedList,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { OnUpdateFlagGlobalsInterface } from 'hooks/use-update-flag';
import { useMemo, useState } from 'react';

export const FlagEditTargetingModal = ({
  flag,
  isOpen,
  onCancel,
  onConfirm,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirm: (props: OnUpdateFlagGlobalsInterface) => void;
  onCancel: () => void;
}) => {
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    return hasComment;
  }, [comment]);

  const flagCurrentEnv = flag.environments[env.key];

  const defaultRules = useMemo(() => {
    // Normally just 0, 1 but could be 0, 1, 2 ,.. or just one number.
    const variationKeys: Array<string> = Object.keys(flagCurrentEnv._summary.variations);
    const targetingOnIndex = Number(
      variationKeys.find((key) => flagCurrentEnv._summary.variations[key].isFallthrough),
    );
    const targetingOffIndex = Number(
      variationKeys.find((key) => flagCurrentEnv._summary.variations[key].isOff),
    );
    const targetingOn = flag.variations[targetingOnIndex];
    const targetingOff = flag.variations[targetingOffIndex];
    return { targetingOn, targetingOff };
  }, [flag, flagCurrentEnv]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit flag global settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList marginTop="3">
            <ListItem>
              Env:{' '}
              <Box
                width="2"
                height="2"
                bg={`#${env.color}`}
                display="inline-block"
                marginRight="2"
              />
              <b>{env.name}</b>
            </ListItem>
            <ListItem>
              Flag: <Tag size="sm">{flag.key}</Tag>
            </ListItem>
          </UnorderedList>
          <Box marginTop="3">
            <FormLabel>
              <b>Prerequisites</b>
            </FormLabel>
            <pre>{JSON.stringify(flagCurrentEnv?.prerequisites, null, 2)}</pre>
            <FormLabel>
              <b>Individual targets</b>
            </FormLabel>
            <pre>{JSON.stringify(flagCurrentEnv?.targets, null, 2)}</pre>
            <FormLabel>
              <b>Rules</b>
            </FormLabel>
            <pre>{JSON.stringify(flagCurrentEnv?.rules, null, 2)}</pre>
          </Box>
          <Box marginTop="3">
            <FormLabel>
              <b>Default rule</b>
            </FormLabel>
            <UnorderedList>
              <ListItem>
                If targeting is <b>ON</b>, serve {JSON.stringify(defaultRules.targetingOn)}
              </ListItem>
              <ListItem>
                If targeting is <b>OFF</b>, serve {JSON.stringify(defaultRules.targetingOff)}
              </ListItem>
            </UnorderedList>
          </Box>
          <Box marginTop="3">
            <FormLabel>Comment</FormLabel>
            <Input
              placeholder="Enter comment describing your change"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button disabled={isUpdatingFlag} colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="gray"
            disabled={!canConfirm || isUpdatingFlag}
            isLoading={isUpdatingFlag}
            onClick={() => {}}
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
