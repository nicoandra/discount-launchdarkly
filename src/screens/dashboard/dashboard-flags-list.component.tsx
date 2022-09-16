import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useListFlags } from 'hooks/use-list-flags';
import lodash from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardFlagListItem } from './dashboard-flag-list-item.component';

const PER_PAGE = 100;

export const DashboardFlagsList = () => {
  const containerBg = useColorModeValue('white', 'black');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const debouncedFilterRef = useRef(
    lodash.debounce((filter) => {
      setPage(0);
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

  const filteredFlags = useMemo(() => {
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
  }, [flags, debouncedFilter, page]);

  const paginatedFlags = useMemo(() => {
    const pageStart = page * PER_PAGE;
    const pageEnd = pageStart + PER_PAGE;
    return filteredFlags.slice(pageStart, pageEnd);
  }, [filteredFlags]);

  const onChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  const memoizedFlagItems = useMemo(() => {
    if (!paginatedFlags?.length) {
      return <Center>No flags found!</Center>;
    }
    return paginatedFlags.map((flag, i, { length }) => {
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
  }, [paginatedFlags]);

  const normalizedPage = useMemo(() => {
    const first = page * PER_PAGE + 1;
    const last = first + paginatedFlags.length - 1;
    const totalFlags = filteredFlags.length;
    const isFirstPage = page === 0;
    const isLastPage = !totalFlags || last >= totalFlags;
    return { first, last, totalFlags, isFirstPage, isLastPage };
  }, [page, paginatedFlags, filteredFlags]);

  if (loadingFlags) {
    return (
      <Center>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box marginTop="4">
      <HStack flex={1} justifyContent="space-between">
        <Box minW="400" maxW="400" paddingLeft="4">
          <InputGroup>
            <Input autoFocus placeholder="Filter flags" value={filter} onChange={onChangeFilter} />
          </InputGroup>
        </Box>
        <HStack>
          <IconButton
            aria-label="Previous Page"
            icon={<ChevronLeftIcon />}
            disabled={normalizedPage.isFirstPage}
            onClick={() => setPage(page - 1)}
          />
          <Text align="right">
            Showing{' '}
            <b>
              {normalizedPage.first}-{normalizedPage.last}
            </b>{' '}
            of {normalizedPage.totalFlags} flags
          </Text>
          <IconButton
            aria-label="Next Page"
            icon={<ChevronRightIcon />}
            onClick={() => setPage(page + 1)}
            disabled={normalizedPage.isLastPage}
          />
        </HStack>
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
