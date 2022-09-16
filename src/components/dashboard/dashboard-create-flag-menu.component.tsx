import { useCallback } from 'react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { CreateFlagParams, useCreateFlag } from 'hooks/use-create-flag';
import { FlagCreateModal } from './modals';

interface DashboardCreateFlagInterface {
  refetchFlags: () => Promise<void>;
}
export const DashboardCreateFlagMenu = ({ refetchFlags }: DashboardCreateFlagInterface) => {
  const { onCreateFlag, isCreatingFlag } = useCreateFlag();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const onConfirm = useCallback(
    async (props: CreateFlagParams) => {
      await onCreateFlag(props);
      refetchFlags();
    },
    [refetchFlags],
  );

  return (
    <>
      <FlagCreateModal
        onCancel={onClose}
        isOpen={isOpen}
        isCreatingFlag={isCreatingFlag}
        onConfirmCreate={onConfirm}
      />
      <Box style={{ float: 'right' }}>
        <Button
          colorScheme="blue"
          rightIcon={<PlusSquareIcon />}
          alignSelf="flex-end"
          onClick={onOpen}
        >
          Create Flag
        </Button>
      </Box>
    </>
  );
};
