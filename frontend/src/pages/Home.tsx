import { useBoardStore } from "../stores/board.store";
import { BoardColumn } from "../components/BoardColumn";
import type { TaskStatus } from "../types/task.type";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
export const Home = () => {
  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);
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
      destination.droppableId as TaskStatus,
      destination.index,
    );
  };

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
