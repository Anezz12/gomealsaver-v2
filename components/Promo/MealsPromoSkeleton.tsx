export default function MealsPromoSkeleton() {
  return (
    <div className="bg-[#141414] rounded-xl shadow-md relative border border-gray-800 overflow-hidden">
      {/* Image skeleton */}
      <div className="w-full h-[200px] bg-gray-800 animate-pulse rounded-t-xl" />

      <div className="p-4">
        <header className="text-left mb-4">
          {/* Cuisine skeleton */}
          <div className="h-4 w-20 bg-gray-800 animate-pulse rounded-full mb-2" />
          {/* Name skeleton */}
          <div className="h-6 w-3/4 bg-gray-800 animate-pulse rounded-md" />
        </header>

        {/* Price Section skeleton */}
        <div className="absolute top-[10px] right-[10px] bg-[#141414]/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-800">
          <div className="flex flex-col items-end gap-1">
            <div className="h-6 w-24 bg-gray-800 animate-pulse rounded-md" />
            <div className="h-4 w-20 bg-gray-800 animate-pulse rounded-md" />
            <div className="h-4 w-16 bg-gray-800 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Info Pills skeleton */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="h-6 w-20 bg-gray-800 animate-pulse rounded-full" />
          <div className="h-6 w-24 bg-gray-800 animate-pulse rounded-full" />
        </div>

        <div className="border-t border-gray-800 my-4"></div>

        {/* Features skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-5 w-16 bg-gray-800 animate-pulse rounded-full"
            />
          ))}
        </div>

        {/* Restaurant Info skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col gap-1 mb-3 lg:mb-0">
            <div className="h-5 w-32 bg-gray-800 animate-pulse rounded-md mb-1" />
            <div className="h-4 w-40 bg-gray-800 animate-pulse rounded-md" />
          </div>
          <div className="w-full lg:w-24 h-9 bg-gray-800 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}
