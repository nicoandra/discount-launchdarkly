import { PageContainer } from 'components/page-container';
import { useListFlags } from 'hooks/use-list-flags';
import { DashboardProjectMenu } from './dashboard-project-menu.component';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { DashboardEnvMenu } from './dashboard-env-menu.component';

export const DashboardScreen = () => {
  const { env, projectKey } = useLaunchDarklyConfig();
  const { loading: loadingFlags, response: flags } = useListFlags({ env: env.key, projectKey });

  console.log({ projectKey, loadingFlags, flags });
  return (
    <PageContainer>
      <DashboardProjectMenu />
      <DashboardEnvMenu />
      <p>TODO: dash goes here</p>
      <p></p>
    </PageContainer>
  );
};
