// {"comment":"testing","environmentKey":"development","instructions":[{"kind":"addUserTargets","values":["user-123"],"variationId":"b17545b3-4478-4acb-a9c0-9b6abd0e5ed0"}]}

import {
  Box,
  Button,
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
  Tag,
  UnorderedList,
} from '@chakra-ui/react';
import { VariationSelect } from 'components/variation-select';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { OnUpdateFlagIndividualTargetsInterface } from 'hooks/use-update-flag';
import { useMemo, useState } from 'react';
import lodash from 'lodash';

export const FlagEditIndividualTargetsModal = ({
  flag,
  isOpen,
  onCancel,
  onConfirm,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirm: (props: OnUpdateFlagIndividualTargetsInterface) => void;
  onCancel: () => void;
}) => {
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const [addUsersCsv, setAddUsersCsv] = useState<string>('');
  const [removeUsersCsv, setRemoveUsersCsv] = useState<string>('');

  const addUsers = useMemo(() => {
    const normalizedUsers = addUsersCsv.split(',').map((user) => user.trim());
    return lodash.compact(normalizedUsers);
  }, [addUsersCsv]);

  const removeUsers = useMemo(() => {
    const normalizedUsers = removeUsersCsv.split(',').map((user) => user.trim());
    return lodash.compact(normalizedUsers);
  }, [removeUsersCsv]);

  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    const hasAddOrRemove = addUsers.length > 0 || removeUsers.length > 0;
    return hasComment && hasAddOrRemove;
  }, [comment, addUsers, removeUsers]);

  const flagCurrentEnv = flag.environments[env.key];

  const existingTargets = useMemo(() => {
    return flag.variations.map((variation, variationIndex) => {
      const targets = flagCurrentEnv.targets.find((target) => target.variation === variationIndex);
      return {
        variation,
        targets: targets?.values ?? [],
      };
    });
  }, [flag, flagCurrentEnv]);

  const [currentVariationId, setCurrentVariationId] = useState<string>(flag.variations[0]._id);

  const existingTargetsForCurrentVariation = useMemo(() => {
    return (
      existingTargets.find((targets) => targets.variation._id === currentVariationId)?.targets ?? []
    );
  }, [currentVariationId]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Flag individual targeting rules</ModalHeader>
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
          <Box marginTop="5">
            <FormLabel>Select variation to individually target:</FormLabel>
            <VariationSelect
              flag={flag}
              variationId={currentVariationId}
              setVariationId={setCurrentVariationId}
            />
          </Box>
          <Box marginTop="5">
            <FormLabel>Existing targets:</FormLabel>
            {existingTargetsForCurrentVariation.length ? (
              <UnorderedList>
                {existingTargetsForCurrentVariation.map((target) => {
                  return <ListItem key={target}>{target}</ListItem>;
                })}
              </UnorderedList>
            ) : (
              <p>No existing targets</p>
            )}
          </Box>
          <Box marginTop="5">
            <FormLabel>Add new targets (comma-separated user IDs):</FormLabel>
            <Input
              placeholder="user-1,user-2,user-3"
              value={addUsersCsv}
              onChange={(e) => setAddUsersCsv(e.target.value)}
            />
          </Box>
          <Box marginTop="5">
            <FormLabel>Remove targets (comma-separated user IDs):</FormLabel>
            <Input
              placeholder="user-1,user-2,user-3"
              value={removeUsersCsv}
              onChange={(e) => setRemoveUsersCsv(e.target.value)}
            />
          </Box>
          <Box marginTop="5">
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
            onClick={() => {
              onConfirm({
                comment,
                addUserTargets: [
                  {
                    variationId: currentVariationId,
                    values: addUsers,
                  },
                ],
                removeUserTargets: [
                  {
                    variationId: currentVariationId,
                    values: removeUsers,
                  },
                ],
              });
            }}
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
