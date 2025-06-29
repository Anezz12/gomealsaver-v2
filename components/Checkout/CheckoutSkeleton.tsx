export default function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Order Summary Skeleton */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sticky top-24">
          <div className="h-6 bg-gray-700 rounded-lg mb-6 animate-pulse"></div>

          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3 mb-6 pt-4 border-t border-gray-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="h-6 bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
