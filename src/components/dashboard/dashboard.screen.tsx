import { PageContainer } from 'components/page-container';
import { DashboardProjectMenu } from './dashboard-project-menu.component';
import { DashboardEnvMenu } from './dashboard-env-menu.component';
import { DashboardFlagsList } from './dashboard-flags-list.component';

export const DashboardScreen = () => {
  return (
    <PageContainer>
      <DashboardProjectMenu />
      <DashboardEnvMenu />
      <DashboardFlagsList />
    </PageContainer>
  );
};
