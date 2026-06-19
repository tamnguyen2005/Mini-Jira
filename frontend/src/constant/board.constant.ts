import type { TaskStatus } from "../types/task.type";

export const TASK_COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: "📋 Backlog", status: "BACKLOG" },
  { title: "🎯 To Do", status: "TODO" },
  { title: "⏳ In Progress", status: "IN_PROGRESS" },
  { title: "✅ Done", status: "DONE" },
];
