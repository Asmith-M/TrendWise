export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
        </div>
        <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          Loading article...
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please wait while we fetch the content
        </p>
      </div>
    </div>
  );
}