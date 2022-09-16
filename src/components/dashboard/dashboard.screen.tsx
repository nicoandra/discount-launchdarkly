import { PageContainer } from 'components/page-container';
import { DashboardProjectMenu } from './dashboard-project-menu.component';
import { DashboardEnvMenu } from './dashboard-env-menu.component';
import { DashboardFlagsList } from './dashboard-flags-list.component';
import { useListFlags } from 'hooks/use-list-flags';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { DashboardCreateFlagMenu } from './dashboard-create-flag-menu.component';

export const DashboardScreen = () => {
  const { env, projectKey } = useLaunchDarklyConfig();
  const {
    loading,
    response: flags,
    refetch: refetchFlags,
  } = useListFlags({ env: env.key, projectKey });

  return (
    <PageContainer>
      <DashboardProjectMenu />
      <DashboardEnvMenu />
      <DashboardCreateFlagMenu refetchFlags={refetchFlags} />
      <DashboardFlagsList loading={loading} flags={flags} refetchFlags={refetchFlags} />
    </PageContainer>
  );
};
