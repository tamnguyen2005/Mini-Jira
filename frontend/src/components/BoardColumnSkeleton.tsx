import { cardSkeleton } from "../constant/skeleton.constant";
import { TaskCardSkeleton } from "./TaskCardSkeleton";
export const BoardColumnSkeleton = () => {
  return (
    <div className="min-h-125 rounded-lg bg-slate-100 p-4">
      <div className="mb-4 flex animate-pulse justify-between">
        <div className="h-4 w-24 rounded bg-slate-300" />
        <div className="size-5 rounded-full bg-slate-300" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: cardSkeleton }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
