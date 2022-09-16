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
  Select,
  Tag,
  UnorderedList,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { OnUpdateFlagIndividualTargetsInterface } from 'hooks/use-update-flag';
import { useMemo, useState } from 'react';

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
  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    return hasComment;
  }, [comment]);

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
            <FormLabel>Existing targets:</FormLabel>
            <pre>{JSON.stringify(existingTargets, null, 2)}</pre>
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
            onClick={
              () => {}
              // onConfirm({
              //   comment,
              // })
            }
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const VariationSelect = ({
  flag,
  variationId,
  setVariationId,
}: {
  flag: FlagItem;
  variationId: string | null;
  setVariationId: (variationId: string) => void;
}) => {
  return (
    <Select
      variant="outline"
      value={variationId ?? 'rollout'}
      onChange={(e) => setVariationId(e.target.value as any)}
    >
      {flag.variations.map((variation) => {
        return (
          <option key={variation._id} value={variation._id}>
            {variation.name} {variation.value.toString()}
          </option>
        );
      })}
      <option value={'rollout'} disabled>
        Percentage rollout (not yet supported)
      </option>
    </Select>
  );
};
