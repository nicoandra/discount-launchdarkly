import { Button } from '@chakra-ui/react';
import { PageContainer } from 'components/page-container';
import { useListEnvironments } from 'hooks/use-list-environments';
import { useState } from 'react';
import { LaunchDarklyProject } from 'utils/launchdarkly-api';
import { useListFlags } from 'hooks/use-list-flags';
import { useEffect } from 'react';

export const DashboardScreen = () => {
  const [projectKey, setProjectKey] = useState<LaunchDarklyProject>(LaunchDarklyProject.DEFAULT);
  const [env, setEnv] = useState<string | null>(null);
  const { loading: loadingEnvironments, response: environments } = useListEnvironments({
    projectKey,
  });

  useEffect(() => {
    if (environments?.items?.length) {
      setEnv(environments.items[0].key);
    }
  }, [environments]);

  const { loading: loadingFlags, response: flags } = useListFlags({ env, projectKey });

  console.log({ projectKey, loadingEnvironments, loadingFlags, environments, flags });
  return (
    <PageContainer>
      <Button onClick={() => setProjectKey(LaunchDarklyProject.DEFAULT)}>Default project</Button>
      <Button onClick={() => setProjectKey(LaunchDarklyProject.ORDERUP)}>OrderUp project</Button>
      <p>TODO: dash goes here</p>
      <p></p>
    </PageContainer>
  );
};
