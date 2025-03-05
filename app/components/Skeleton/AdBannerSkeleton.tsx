export default function AdBannerSkeleton() {
  return (
    <div className="sticky top-0 z-40 bg-gray-100 dark:bg-zinc-800 animate-pulse">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <div className="space-y-3">
            <div className="hidden md:block h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
            <div className="md:hidden h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
