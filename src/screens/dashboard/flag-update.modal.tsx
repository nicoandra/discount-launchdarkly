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

export const FlagUpdateModal = ({
  flag,
  isOpen,
  onCancel,
  onConfirmUpdateGlobals,
  isUpdatingFlag,
}: {
  flag: FlagItem;
  isUpdatingFlag: boolean;
  isOpen: boolean;
  onConfirmUpdateGlobals: ({
    name,
    description,
    usingMobileKey,
    usingEnvironmentId,
    comment,
  }: OnUpdateFlagGlobalsInterface) => void;
  onCancel: () => void;
}) => {
  console.log('FlagUpdate:', flag);
  const { env } = useLaunchDarklyConfig();
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>(flag.name);
  const [description, setDescription] = useState<string>(flag.description);
  const [usingMobileKey, setUsingMobilekey] = useState<boolean>(
    flag.clientSideAvailability.usingMobileKey,
  );
  const [usingEnvironmentId, setUsingEnvironmentId] = useState<boolean>(
    flag.clientSideAvailability.usingEnvironmentId,
  );
  const canConfirm = useMemo(() => {
    const hasComment = (comment ?? '').trim().length > 0;
    const hasName = (name ?? '').trim().length > 0;
    return hasComment && hasName;
  }, [comment, name]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modify flag global config</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList>
            <ListItem>
              Env: <b>All Environments</b>
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
            <FormLabel>
              Client-side SDK availability. Control which client-side SDKs can use this flag.
            </FormLabel>
            <Stack spacing={5} direction="row">
              <Checkbox
                isChecked={usingMobileKey}
                onChange={(e) => setUsingMobilekey(e.target.checked)}
              >
                Mobile (React Native)
              </Checkbox>
              <Checkbox
                isChecked={usingEnvironmentId}
                onChange={(e) => setUsingEnvironmentId(e.target.checked)}
              >
                Web Browser (Terminal)
              </Checkbox>
            </Stack>
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
              onConfirmUpdateGlobals({
                name,
                description,
                usingEnvironmentId,
                usingMobileKey,
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
