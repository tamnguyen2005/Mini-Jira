import { devtools, persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types/task.type";
import type { TaskFormOutput } from "../schemas/task.schema";
import { create } from "zustand";
import {
  taskService,
  type QueryTaskRequest,
  type UpdateStatusRequest,
} from "../services/task.service";
interface BoardState {
  tasks: Task[];
  totalTasks: number;
  isModalOpen: boolean;
  taskToEdit: Task | null;
  isLoading: boolean;
  fetchError: string | null;
  addTask: (task: TaskFormOutput) => Promise<void>;
  updateTask: (id: string, task: Partial<TaskFormOutput>) => Promise<void>;
  moveTask: (
    id: string,
    sourceStatus: TaskStatus,
    desStatus: TaskStatus,
    index: number,
  ) => Promise<void>;
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
  fetchTasks: (query?: QueryTaskRequest) => Promise<Task[]>;
  deleteTask: (id: string) => Promise<void>;
}
export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        isModalOpen: false,
        taskToEdit: null,
        isLoading: false,
        fetchError: null,
        totalTasks: 0,
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
        addTask: async (task) => {
          const position = get().tasks.filter(
            (currentTask) => currentTask.status === task.status,
          ).length;
          const createdTask = await taskService.createTask({
            ...task,
            position,
          });
          set(
            (state) => ({
              tasks: [...state.tasks, createdTask],
            }),
            false,
            "task/addTask",
          );
        },
        updateTask: async (id, task) => {
          const updatedTask = await taskService.updateTask(id, task);
          set(
            (state) => ({
              tasks: state.tasks.map((currentTask) =>
                currentTask.id === id ? updatedTask : currentTask,
              ),
            }),
            false,
            "task/updateTask_success",
          );
        },
        moveTask: async (id, sourceStatus, desStatus, index) => {
          const backup = get().tasks;
          const updatedTasks = renderTask(backup, id, index, desStatus);
          set({ tasks: updatedTasks }, false, "task/update_optimistic");
          try {
            await taskService.updateStatus(
              renderUpdateRequest(updatedTasks, sourceStatus, desStatus),
            );
          } catch (err) {
            console.log(err);
            set({ tasks: backup }, false, "task/rollback");
          }
        },
        fetchTasks: async (query) => {
          set(
            { isLoading: true, fetchError: null },
            false,
            "task/fetch_pending",
          );
          try {
            const response = await taskService.getTask(query);
            const tasks = Array.isArray(response.data) ? response.data : [];
            set(
              {
                tasks,
                isLoading: false,
                totalTasks: response.pagination.total,
              },
              false,
              "task/fetchTasks",
            );
            return tasks;
          } catch (err) {
            set(
              { isLoading: false, fetchError: getErrorMessage(err) },
              false,
              "task/fetch_error",
            );
            return [];
          }
        },
        deleteTask: async (id) => {
          const backup = get().tasks;
          set(
            {
              tasks: backup.filter((t) => t.id !== id),
            },
            false,
            "task/delete_optimistic",
          );
          try {
            await taskService.deleteTask(id);
          } catch {
            set({ tasks: backup }, false, "task/delete_rollback");
          }
        },
      }),
      {
        name: "board-storage",
        version: 1,
        migrate: (persistedState) => {
          if (
            persistedState &&
            typeof persistedState === "object" &&
            "tasks" in persistedState &&
            !Array.isArray(persistedState.tasks)
          ) {
            return {
              ...persistedState,
              tasks: [],
            };
          }

          return persistedState;
        },
      },
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
  const movedTask = { ...taskToMove, status: status };
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
const renderUpdateRequest = (
  updatedTasks: Task[],
  sourceStatus: TaskStatus,
  desStatus: TaskStatus,
): UpdateStatusRequest => {
  const affectedStatuses =
    sourceStatus === desStatus ? [sourceStatus] : [sourceStatus, desStatus];

  return {
    columns: affectedStatuses.map((status) => ({
      status,
      taskIds: updatedTasks
        .filter((task) => task.status === status)
        .map((task) => task.id),
    })),
  };
};
const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof err.message === "string"
  ) {
    return err.message;
  }
  return "Không thể tải danh sách task";
};
