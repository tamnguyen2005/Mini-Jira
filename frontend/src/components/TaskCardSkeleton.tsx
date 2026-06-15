export const TaskCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="size-8 rounded-lg bg-slate-200" />
        <div className="h-5 w-14 rounded bg-slate-200" />
      </div>

      <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>

      <div className="mt-5 h-3 w-1/2 rounded bg-slate-200" />
    </div>
  );
};
