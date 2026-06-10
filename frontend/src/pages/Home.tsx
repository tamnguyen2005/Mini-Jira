import { useBoardStore } from "../stores/board.store";
import { BoardColumn } from "../components/BoardColumn";
import type { TaskStatus } from "../types/task.type";
export const Home = () => {
  const tasks = useBoardStore((state) => state.tasks);
  const columns: { title: string; status: TaskStatus }[] = [
    { title: "📋 Backlog", status: "BACKLOG" },
    { title: "🎯 To Do", status: "TODO" },
    { title: "⏳ In Progress", status: "IN_PROGRESS" },
    { title: "✅ Done", status: "DONE" },
  ];

  return (
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
  );
};
