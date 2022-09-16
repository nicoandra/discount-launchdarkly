import { useLaunchDarklyApi } from 'hooks/use-launchdarkly-api';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useCallback, useEffect, useState } from 'react';
import { LaunchDarklyApiFetchProps } from 'utils/launchdarkly-api';

export interface UseLdGetAPI<T> {
  loading: boolean;
  response: T | null;
  refetch: () => Promise<void>;
}

export const useLdGet = <T>(
  props: LaunchDarklyApiFetchProps,
  dependencyArray: React.DependencyList,
): UseLdGetAPI<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<T | null>(null);
  const { launchDarklyApi } = useLaunchDarklyApi();

  const refetchWithProps = useCallback(async (fetchProps: LaunchDarklyApiFetchProps) => {
    const responseJSON = await launchDarklyApi.fetch<T>(fetchProps);
    setResponse(responseJSON);
    setLoading(false);
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    return refetchWithProps(props);
  }, [props]);

  useEffect(() => {
    setLoading(true);
    refetchWithProps(props);
  }, dependencyArray);

  return {
    loading,
    response,
    refetch,
  };
};
