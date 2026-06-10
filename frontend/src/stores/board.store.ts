import { devtools, persist } from "zustand/middleware";
import type { Task } from "../types/task.type";
import { create } from "zustand";
interface BoardState {
  tasks: Task[];
  isModalOpen: boolean;
  taskToEdit: Task | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
}
export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        isModalOpen: false,
        taskToEdit: null,
        openCreateModal: () =>
          set(
            { isModalOpen: true, taskToEdit: null },
            false,
            "task/openCreateBoard",
          ),
        openEditModal: (task) =>
          set(
            { isModalOpen: true, taskToEdit: task },
            false,
            "task/openEditBoard",
          ),
        closeModal: () =>
          set(
            { isModalOpen: false, taskToEdit: null },
            false,
            "task/closeModal",
          ),
        addTask: (task) =>
          set(
            (state) => ({
              tasks: [
                ...state.tasks,
                {
                  id: Date.now().toString(),
                  title: task.title,
                  description: task.description,
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
        updateTask: (id, task) =>
          set(
            (state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      ...task,
                    }
                  : t,
              ),
            }),
            false,
            "task/updateTask",
          ),
      }),
      { name: "board-storage" },
    ),
  ),
);
