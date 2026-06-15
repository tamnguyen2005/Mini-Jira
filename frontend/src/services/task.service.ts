import type { Task, TaskStatus } from "../types/task.type";
import { api } from "../api/api";
import type { TaskFormOutput } from "../schemas/task.schema";

export type CreateTaskRequest = TaskFormOutput & {
  position: number;
};

export const taskService = {
  updateTask: async (id: string, task: TaskFormOutput): Promise<Task> => {
    return api.put(`/task/${id}`, task);
  },
  updateStatus: async (updateStatus: UpdateStatusRequest): Promise<void> => {
    return api.patch(`/task/status`, updateStatus);
  },
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    return api.post("/task", task);
  },
  getTask: async (): Promise<Task[]> => {
    return api.get("/task");
  },
  deleteTask: async (id: string): Promise<void> => {
    return api.delete(`/task/${id}`);
  },
};
export interface UpdateStatusRequest {
  columns: Column[];
}
export interface Column {
  status: TaskStatus;
  taskIds: string[];
}
