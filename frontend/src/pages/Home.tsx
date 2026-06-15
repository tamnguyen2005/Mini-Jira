import { useBoardStore } from "../stores/board.store";
import { BoardColumn } from "../components/BoardColumn";
import type { TaskStatus } from "../types/task.type";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { BoardColumnSkeleton } from "../components/BoardColumnSkeleton";
import { boardColumnSkeleton } from "../constant/skeleton.constant";
export const Home = () => {
  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);
  const fetchTasks = useBoardStore((state) => state.fetchTasks);
  const isLoading = useBoardStore((state) => state.isLoading);
  const fetchError = useBoardStore((state) => state.fetchError);
  const columns: { title: string; status: TaskStatus }[] = [
    { title: "📋 Backlog", status: "BACKLOG" },
    { title: "🎯 To Do", status: "TODO" },
    { title: "⏳ In Progress", status: "IN_PROGRESS" },
    { title: "✅ Done", status: "DONE" },
  ];

  const onDragEnd = (result: DropResult) => {
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
  };
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {Array.from({ length: boardColumnSkeleton }).map((_, index) => (
            <BoardColumnSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  if (fetchError)
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <h1 className="text-3xl text-red-600 text-center">
          Load dữ liệu từ server thất bại. Vui lòng thử lại sau
        </h1>
      </div>
    );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const filteredTasks = tasks.filter((t) => t.status === col.status);
            return (
              <BoardColumn
                key={col.status}
                title={col.title}
                status={col.status}
                tasks={filteredTasks}
              />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};
