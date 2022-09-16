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
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { FlagItem } from 'hooks/use-list-flags';
import { useMemo, useState } from 'react';

export const FlagUpdateModal = ({
  flag,
  isOpen,
  onCancel,
  onConfirmUpdateMetadata,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirmUpdateMetadata: ({
    name,
    description,
    comment,
  }: {
    name: string;
    description: string;
    comment: string;
  }) => void;
  onCancel: () => void;
}) => {
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>(flag.name);
  const [description, setDescription] = useState<string>(flag.description);
  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    const hasName = (name ?? '').trim().length > 0;
    return hasComment && hasName;
  }, [comment, name]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modify flag</ModalHeader>
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
          </UnorderedList>
          <Box marginTop="3">
            <FormLabel> Name</FormLabel>
            <Input placeholder="Flag name" value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
          <Box marginTop="3">
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Flag description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <Box marginTop="3">
            <Button
              colorScheme="gray"
              disabled={!canConfirm || isUpdatingFlag}
              isLoading={isUpdatingFlag}
              onClick={() => onConfirmUpdateMetadata({ name, description, comment })}
            >
              Update name & description
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
