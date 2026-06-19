import { useBoardStore } from "../stores/board.store";
import { BoardColumn } from "../components/BoardColumn";
import type { Task, TaskStatus } from "../types/task.type";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BoardColumnSkeleton } from "../components/BoardColumnSkeleton";
import { boardColumnSkeleton } from "../constant/skeleton.constant";
import { FilterToolBar } from "../components/FilterToolBar";
import { useSearchParams } from "react-router-dom";
import { TASK_COLUMNS } from "../constant/board.constant";
export const Home = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);
  const fetchTasks = useBoardStore((state) => state.fetchTasks);
  const isLoading = useBoardStore((state) => state.isLoading);
  const fetchError = useBoardStore((state) => state.fetchError);
  const totalTasks = useBoardStore((state) => state.totalTasks);
  const [searchParams] = useSearchParams();
  const tasksByStatus = useMemo(
    () =>
      tasks.reduce(
        (acc, task) => {
          acc[task.status].push(task);
          return acc;
        },
        {
          BACKLOG: [] as Task[],
          TODO: [] as Task[],
          IN_PROGRESS: [] as Task[],
          DONE: [] as Task[],
        },
      ),
    [tasks],
  );
  const titleUrl = searchParams.get("title") || "";
  const assigneeIdUrl = searchParams.get("assigneeId") || "";
  const priorityUrl = searchParams.get("priority") || "";
  const dueFromUrl = searchParams.get("dueFrom") || "";
  const dueToUrl = searchParams.get("dueTo") || "";
  useEffect(() => {
    void fetchTasks({
      title: titleUrl || undefined,
      priority: priorityUrl || undefined,
      assigneeId: assigneeIdUrl || undefined,
      dueFrom: dueFromUrl || undefined,
      dueTo: dueToUrl || undefined,
    });
  }, [fetchTasks, titleUrl, priorityUrl, assigneeIdUrl, dueFromUrl, dueToUrl]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowSkeleton(isLoading),
      isLoading ? 200 : 0,
    );

    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const isBoardEmpty = tasks.length === 0;
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }
      moveTask(
        draggableId,
        source.droppableId as TaskStatus,
        destination.droppableId as TaskStatus,
        destination.index,
      );
    },
    [moveTask],
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-slate-50 p-6">
        <FilterToolBar />
        {searchParams.toString() && (
          <p className="text-xs text-gray-500 mb-4 font-medium">
            📊 Tìm thấy{" "}
            <span className="text-blue-600 font-bold">{totalTasks}</span> nhiệm
            vụ phù hợp với bộ lọc.
          </p>
        )}
        {showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {Array.from({ length: boardColumnSkeleton }).map((_, index) => (
              <BoardColumnSkeleton key={index} />
            ))}
          </div>
        ) : fetchError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-bold text-red-600">
              Load dữ liệu từ server thất bại. Vui lòng thử lại sau
            </h1>
          </div>
        ) : isBoardEmpty ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center max-w-md mx-auto mt-8 shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-xs text-gray-400">
              Không có nhiệm vụ nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử
              đổi từ khóa hoặc xóa bớt bộ lọc nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {TASK_COLUMNS.map((col) => (
              <BoardColumn
                key={col.status}
                title={col.title}
                status={col.status}
                tasks={tasksByStatus[col.status]}
              />
            ))}
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
