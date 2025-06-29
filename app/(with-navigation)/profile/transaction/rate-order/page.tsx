import { Suspense } from 'react';
import MainContainer from '@/components/Settings/MainContainer';
import RateOrderContent from '@/components/Orders/RateOrderContent';

export default function RateOrderPage() {
  return (
    <MainContainer>
      <Suspense fallback={<RateOrderLoading />}>
        <RateOrderContent />
      </Suspense>
    </MainContainer>
  );
}

function RateOrderLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    </div>
  );
}
