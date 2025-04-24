import ProductsPage from '@/components/Dashboard/ProductDashboard';
import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';
export default function ProductPage() {
  return (
    <>
      <MainContainerDashboard>
        <ProductsPage />
      </MainContainerDashboard>
    </>
  );
}
