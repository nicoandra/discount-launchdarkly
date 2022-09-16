import { CopyIcon } from '@chakra-ui/icons';
import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FlagItem } from 'hooks/use-list-flags';
import { useCallback, useMemo } from 'react';

export const FlagDebugModal = ({
  flag,
  isOpen,
  onCancel,
}: {
  flag: FlagItem;
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const prettyJSON = useMemo(() => {
    return JSON.stringify(flag, null, 2);
  }, [flag]);
  const onClickCopy = useCallback(() => {
    navigator.clipboard.writeText(prettyJSON);
  }, [prettyJSON]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ModalHeader>Debug Flag JSON</ModalHeader>
          <Button rightIcon={<CopyIcon />} onClick={onClickCopy}>
            Copy JSON to Clipboard
          </Button>
          <Code marginTop="4" whiteSpace={'pre'} display="block">
            {prettyJSON}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
