export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-zinc-800/50 p-6 space-y-4 border border-gray-100 dark:border-zinc-700">
      {children}
    </div>
  );
}
