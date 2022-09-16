import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FlagItem } from 'hooks/use-list-flags';
import { useMemo } from 'react';

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
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Debug Flag (raw JSON)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <pre>{prettyJSON}</pre>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
