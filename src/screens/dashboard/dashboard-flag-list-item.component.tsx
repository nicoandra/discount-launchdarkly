import { CopyIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Link, Stack, Tag, Text, Tooltip } from '@chakra-ui/react';
import { FlagItem } from 'hooks/use-list-flags';
import moment from 'moment';
import { useCallback, useMemo } from 'react';

interface DashboardFlagListItemInterface {
  flag: FlagItem;
  setFilter: (newFilter: string) => void;
  isLastItem: boolean;
}
export const DashboardFlagListItem = ({
  flag,
  setFilter,
  isLastItem,
}: DashboardFlagListItemInterface) => {
  const { creationDateFormatted, creationDateRelative } = useMemo(() => {
    const creationDateMoment = moment(flag.creationDate);
    return {
      creationDateFormatted: creationDateMoment.format(),
      creationDateRelative: creationDateMoment.fromNow(),
    };
  }, [flag.creationDate]);

  const copyKeyOnClick = useCallback(() => {
    navigator.clipboard.writeText(flag.key);
  }, [flag.key]);

  const openFlagDetails = useCallback(() => {
    console.log('todo: open flag', flag);
  }, [flag]);

  return (
    <Stack
      direction="row"
      borderBottom={isLastItem ? '0px' : '1px'}
      borderColor="gray"
      paddingBottom="2"
      paddingTop="2"
    >
      <Box>
        <HStack>
          <Link color="blue.400" onClick={openFlagDetails}>
            <Text fontSize="md" as="b">
              {flag.name}
            </Text>
          </Link>
          <Tooltip label={creationDateFormatted}>
            <Text fontSize="xs" color="gray">
              Created {creationDateRelative}
            </Text>
          </Tooltip>
        </HStack>
        <Button marginTop="1" colorScheme="gray" size="xs" onClick={copyKeyOnClick}>
          {flag.key}
          <CopyIcon marginLeft="2" />
        </Button>
        <Box marginTop="1">
          <Text fontSize="sm">{flag.description}</Text>
        </Box>
        {flag.tags?.length ? (
          <Box marginTop="1">
            {flag.tags.map((tag) => {
              return (
                <Tag
                  size="sm"
                  variant="outline"
                  marginRight="2"
                  key={`${flag.key}-${tag}`}
                  onClick={() => setFilter(tag)}
                  cursor="pointer"
                >
                  {tag}
                </Tag>
              );
            })}
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Stack>
  );
};
