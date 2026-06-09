import { devtools, persist } from "zustand/middleware";
import type { Task } from "../types/task.type";
import { create } from "zustand";
interface BoardState {
  tasks: Task[];
  addTask: (task: Task) => void;
}
export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set) => ({
        tasks: [
          {
            id: "1",
            title: "Thiết lập cấu trúc Monorepo",
            assignee: {
              id: "user_1",
              name: "Minh Tam",
            },
            createdAt: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            priority: "HIGH",
            status: "BACKLOG",
          },
          {
            id: "2",
            title: "Bật TypeScript Strict Mode",
            assignee: {
              id: "user_2",
              name: "Dang Khoa",
            },
            createdAt: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            priority: "HIGH",
            status: "TODO",
          },
          {
            id: "3",
            title: "Dựng bộ khung Layout 4 cột",
            assignee: {
              id: "user_3",
              name: "Khoi Nguyen",
            },
            createdAt: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            priority: "HIGH",
            status: "IN_PROGRESS",
          },
        ],
        addTask: (task) =>
          set(
            (state) => ({
              tasks: [
                ...state.tasks,
                {
                  id: Date.now().toString(),
                  title: task.title,
                  assignee: task.assignee,
                  createdAt: new Date().toISOString(),
                  dueDate: new Date().toISOString(),
                  priority: task.priority,
                  status: task.status,
                },
              ],
            }),
            false,
            "task/addTask",
          ),
      }),
      { name: "board-storage" },
    ),
  ),
);
