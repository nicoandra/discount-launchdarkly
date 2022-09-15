import {
  Box,
  Button,
  Center,
  HStack,
  Link,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useListFlags } from 'hooks/use-list-flags';
import moment from 'moment';
import lodash from 'lodash';
import { useMemo } from 'react';
import { CopyIcon } from '@chakra-ui/icons';

export const DashboardFlagsList = () => {
  const containerBg = useColorModeValue('white', 'black');

  const { env, projectKey } = useLaunchDarklyConfig();
  const { loading: loadingFlags, response: flags } = useListFlags({ env: env.key, projectKey });

  console.log({ projectKey, loadingFlags, flags });

  const sortedFilteredFlags = useMemo(() => {
    if (!flags?.items?.length) {
      return [];
    }
    return lodash.orderBy(flags.items, 'creationDate', 'desc');
  }, [flags]);

  if (loadingFlags) {
    return (
      <Center>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  if (!flags?.items?.length) {
    return <Center>No flags found for this project/env!</Center>;
  }

  return (
    <Box marginTop="4">
      <p>
        Showing <b>{sortedFilteredFlags.length}</b> flags
      </p>
      <Box
        bg={containerBg}
        marginTop="4"
        paddingLeft="4"
        paddingRight="4"
        paddingTop="2"
        paddingBottom="2"
        borderRadius="md"
      >
        {sortedFilteredFlags.map((flag) => {
          return (
            <Stack
              direction="row"
              borderBottom="1px"
              borderColor="gray"
              paddingBottom="2"
              paddingTop="2"
            >
              <Box>
                <HStack>
                  <Link color="blue.400" onClick={() => console.log('todo:', flag)}>
                    <Text fontSize="md" as="b">
                      {flag.name}
                    </Text>
                  </Link>
                  <Tooltip label={moment(flag.creationDate).format()}>
                    <Text fontSize="sm" color="gray">
                      Created {moment(flag.creationDate).fromNow()}
                    </Text>
                  </Tooltip>
                </HStack>
                <Button
                  marginTop="1"
                  colorScheme="gray"
                  size="xs"
                  onClick={() => navigator.clipboard.writeText(flag.key)}
                >
                  {flag.key}
                  <CopyIcon marginLeft="2" />
                </Button>
                <Box marginTop="1">
                  <Text fontSize="sm" color="gray">
                    {flag.description}
                  </Text>
                </Box>
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
};
