import OrdersPage from '@/components/Dashboard/OrderDashboard';
import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';

export const dynamic = 'force-dynamic';

export default function OrdersDashboard() {
  return (
    <MainContainerDashboard>
      <OrdersPage />
    </MainContainerDashboard>
  );
}
