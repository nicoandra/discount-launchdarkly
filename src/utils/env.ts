export const getApiKeyOrThrow = (): string => {
  const apiKey = process.env.REACT_APP_LAUNCHDARKLY_API_KEY;
  if (!apiKey) {
    const errorMessage = 'Error: must specify REACT_APP_LAUNCHDARKLY_API_KEY in `.env`';
    window.alert(errorMessage);
    throw Error(errorMessage);
  }
  return apiKey;
};
