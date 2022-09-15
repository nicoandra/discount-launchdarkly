import {
  Box,
  Button,
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
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useMemo, useState } from 'react';

export const FlagTargetingToggleModal = ({
  flag,
  isFlagTargetingOn,
  isOpen,
  onCancel,
  onConfirm,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isFlagTargetingOn: boolean;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirm: ({ comment }: { comment: string }) => void;
  onCancel: () => void;
}) => {
  const newTargeting = isFlagTargetingOn ? 'OFF' : 'ON';
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const canConfirm = useMemo(() => {
    return (comment ?? '').trim().length > 0;
  }, [comment]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Turn <u>{newTargeting}</u> targeting
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList>
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
            <ListItem>New targeting value: {newTargeting}</ListItem>
          </UnorderedList>
          <Box marginTop="3">
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
            onClick={() => onConfirm({ comment })}
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
