import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
} from '@chakra-ui/react';
import lodash from 'lodash';
import { CreateFlagParams } from 'hooks/use-create-flag';

export const FlagCreateModal = ({
  isOpen,
  onCancel,
  onConfirmCreate,
  isCreatingFlag,
}: {
  isCreatingFlag: boolean;
  isOpen: boolean;
  onConfirmCreate: (props: CreateFlagParams) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [usingMobileKey, setUsingMobilekey] = useState<boolean>(false);
  const [usingEnvironmentId, setUsingEnvironmentId] = useState<boolean>(false);
  const [isPermament, setIsPermament] = useState<boolean>(false);
  const [tagsCsv, setTagsCsv] = useState<string>('');

  const tags = useMemo(() => {
    const normalizedTags = tagsCsv.split(',').map((tag) => tag.trim());
    return lodash.compact(normalizedTags);
  }, [tagsCsv]);

  const canConfirm = useMemo(() => {
    const hasName = (name ?? '').trim().length > 0;
    const hasKey = (key ?? '').trim().length > 0;
    return hasName && hasKey;
  }, [name, key]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new feature flag</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box marginTop="3">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Flag name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
          </Box>
          <Box marginTop="3">
            <FormLabel>Key</FormLabel>
            <Input
              placeholder="Flag key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              isRequired
            />
          </Box>
          <Box marginTop="3">
            <FormLabel>Description (optional)</FormLabel>
            <Input
              placeholder="Flag description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box marginTop="3">
            <FormLabel>Tags (optional)</FormLabel>
            <Input
              placeholder="comma,separated,tags"
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
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
                Web Browser
              </Checkbox>
            </Stack>
          </Box>
          <Box marginTop="3">
            <FormLabel>Flag variations</FormLabel>
            <Select variant="outline" onChange={(e) => console.log('select:', e)}>
              <option value="boolean">Boolean</option>
              <option value="string">String</option>
              {/* add other options eventually: number / JSON */}
            </Select>
            <Box></Box>
          </Box>
          <Box marginTop="3">
            <Checkbox isChecked={isPermament} onChange={(e) => setIsPermament(e.target.checked)}>
              This is a permament flag
            </Checkbox>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button disabled={isCreatingFlag} colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="gray"
            disabled={!canConfirm || isCreatingFlag}
            isLoading={isCreatingFlag}
            onClick={() =>
              onConfirmCreate({
                name,
                key,
                description,
                clientSideAvailability: {
                  usingEnvironmentId,
                  usingMobileKey,
                },
                variations: [{ value: true }, { value: false }],
                defaults: {
                  onVariation: 0,
                  offVariation: 1,
                },
                tags,
                temporary: !isPermament,
              })
            }
          >
            Create flag
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
