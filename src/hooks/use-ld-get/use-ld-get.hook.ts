import { useCallback, useEffect, useState } from 'react';
import { launchDarklyApi, LaunchDarklyApiFetchProps } from 'utils/launchdarkly-api';

export interface UseLdGetAPI<T> {
  loading: boolean;
  response: T | null;
  refetch: (props: LaunchDarklyApiFetchProps) => Promise<void>;
}

export const useLdGet = <T>(
  props: LaunchDarklyApiFetchProps,
  dependencyArray: React.DependencyList,
): UseLdGetAPI<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<T | null>(null);

  const refetch = useCallback(async (fetchProps: LaunchDarklyApiFetchProps) => {
    const responseJSON = await launchDarklyApi.fetch<T>(fetchProps);
    setResponse(responseJSON);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    refetch(props);
  }, dependencyArray);

  return {
    loading,
    response,
    refetch,
  };
};
