import { devtools, persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types/task.type";
import { create } from "zustand";
import { taskService } from "../services/task.service";
interface BoardState {
  tasks: Task[];
  isModalOpen: boolean;
  taskToEdit: Task | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus, index: number) => Promise<void>;
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
}
export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
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
        moveTask: async (id, status, index) => {
          const backup = JSON.parse(JSON.stringify(get().tasks));
          set(
            { tasks: renderTask(backup, id, index, status) },
            false,
            "task/update_optimistic",
          );
          try {
            await taskService.updateTask(id, { status: status });
          } catch (err) {
            console.log(err);
            set({ tasks: backup }, false, "task/rollback");
          }
        },
      }),
      { name: "board-storage" },
    ),
  ),
);
const renderTask = (
  tasks: Task[],
  id: string,
  index: number,
  status: TaskStatus,
): Task[] => {
  const taskToMove = tasks.find((task) => task.id === id);
  if (!taskToMove) return;

  const remainingTasks = tasks.filter((task) => task.id !== id);
  const movedTask = { ...taskToMove, status };
  let insertIndex = remainingTasks.length;
  let statusTaskCount = 0;

  for (let i = 0; i < remainingTasks.length; i += 1) {
    if (remainingTasks[i].status !== status) continue;

    if (statusTaskCount === index) {
      insertIndex = i;
      break;
    }

    statusTaskCount += 1;
    insertIndex = i + 1;
  }

  return [
    ...remainingTasks.slice(0, insertIndex),
    movedTask,
    ...remainingTasks.slice(insertIndex),
  ];
};
