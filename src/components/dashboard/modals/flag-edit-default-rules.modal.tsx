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
import { OnUpdateFlagDefaultRulesInterface } from 'hooks/use-update-flag';
import { useMemo, useState } from 'react';
import lodash from 'lodash';

export const FlagEditDefaultRulesModal = ({
  flag,
  isOpen,
  onCancel,
  onConfirm,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirm: (props: OnUpdateFlagDefaultRulesInterface) => void;
  onCancel: () => void;
}) => {
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    return hasComment;
  }, [comment]);

  const flagCurrentEnv = flag.environments[env.key];

  const existingDefaultRules = useMemo(() => {
    // Normally just 0, 1 but could be 0, 1, 2 ,.. or just one number.
    const variationKeys: Array<string> = Object.keys(flagCurrentEnv._summary.variations);
    const targetingOnIndex = Number(
      variationKeys.find((key) => flagCurrentEnv._summary.variations[key].isFallthrough),
    );
    const targetingOffIndex = Number(
      variationKeys.find((key) => flagCurrentEnv._summary.variations[key].isOff),
    );
    // TODO: handle rollout
    const targetingOn = targetingOnIndex != null ? flag.variations[targetingOnIndex] : null;
    const targetingOff = flag.variations[targetingOffIndex];
    return { targetingOn, targetingOff };
  }, [flag, flagCurrentEnv]);

  const [fallthroughVariationId, setFallthroughVariationId] = useState<string | null>(
    existingDefaultRules.targetingOn?._id ?? null,
  );
  const [offVariationId, setOffVariationId] = useState<string>(
    existingDefaultRules.targetingOff._id,
  );

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Flag default targeting rules</ModalHeader>
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
            <FormLabel>
              If flag targeting is <b>ON</b>, serve this default (fallthrough) variation:
            </FormLabel>
            <VariationSelect
              flag={flag}
              variationId={fallthroughVariationId}
              setVariationId={setFallthroughVariationId}
            />
          </Box>
          <Box marginTop="3">
            <FormLabel>
              If flag targeting is <b>OFF</b>, serve this variation:
            </FormLabel>
            <VariationSelect
              flag={flag}
              variationId={offVariationId}
              setVariationId={setOffVariationId}
            />
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
            onClick={() =>
              onConfirm({
                fallthroughVariationId,
                offVariationId,
                comment,
              })
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
