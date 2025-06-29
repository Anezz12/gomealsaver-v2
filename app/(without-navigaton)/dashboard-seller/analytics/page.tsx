import SellerAnalyticsPage from '@/components/Dashboard/AnalyticsDashbord';
import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';

export const dynamic = 'force-dynamic';

export default function AnalyticsDashboard() {
  return (
    <MainContainerDashboard>
      <SellerAnalyticsPage />
    </MainContainerDashboard>
  );
}
