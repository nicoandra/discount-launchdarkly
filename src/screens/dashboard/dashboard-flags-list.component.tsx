import {
  Box,
  Center,
  HStack,
  Input,
  InputGroup,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useListFlags } from 'hooks/use-list-flags';
import lodash from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardFlagListItem } from './dashboard-flag-list-item.component';

export const DashboardFlagsList = () => {
  const containerBg = useColorModeValue('white', 'black');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');

  const debouncedFilterRef = useRef(
    lodash.debounce((filter) => {
      setDebouncedFilter(filter);
    }, 200),
  ).current;

  useEffect(() => {
    debouncedFilterRef(filter);
  }, [filter]);

  const { env, projectKey } = useLaunchDarklyConfig();
  const {
    loading: loadingFlags,
    response: flags,
    refetch: refetchFlags,
  } = useListFlags({ env: env.key, projectKey });

  // console.log({ projectKey, loadingFlags, flags });

  const sortedFilteredFlags = useMemo(() => {
    if (!flags?.items?.length) {
      return [];
    }
    let filteredFlags = flags.items;
    const normalizedFilter = (debouncedFilter ?? '').trim().toLocaleLowerCase();
    if (normalizedFilter.length > 2) {
      filteredFlags = filteredFlags.filter(
        (flag) =>
          flag.key.includes(normalizedFilter) ||
          flag.name.toLocaleLowerCase().includes(normalizedFilter) ||
          lodash.find(flag.tags ?? [], (tag) => tag.toLocaleLowerCase().includes(normalizedFilter)),
      );
    }
    return lodash.orderBy(filteredFlags, 'creationDate', 'desc');
  }, [flags, debouncedFilter]);

  const onChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  const memoizedFlagItems = useMemo(() => {
    if (!sortedFilteredFlags?.length) {
      return <Center>No flags found!</Center>;
    }
    return sortedFilteredFlags.map((flag, i, { length }) => {
      const isLastItem = i + 1 === length;
      return (
        <DashboardFlagListItem
          key={flag.key}
          flag={flag}
          setFilter={setFilter}
          isLastItem={isLastItem}
          refetchFlags={refetchFlags}
        />
      );
    });
  }, [sortedFilteredFlags]);

  if (loadingFlags) {
    return (
      <Center>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box marginTop="4">
      <HStack>
        <Box>
          Showing <b>{sortedFilteredFlags.length}</b> flags
        </Box>
        <Box minW="400" maxW="400" paddingLeft="4">
          <InputGroup>
            <Input placeholder="Filter flags" value={filter} onChange={onChangeFilter} />
          </InputGroup>
        </Box>
      </HStack>
      <Box
        bg={containerBg}
        marginTop="4"
        paddingLeft="4"
        paddingRight="4"
        paddingTop="2"
        paddingBottom="2"
        borderRadius="md"
      >
        {memoizedFlagItems}
      </Box>
    </Box>
  );
};
