import type { Task, TaskStatus } from "../types/task.type";
import { api } from "../api/api";
import type { TaskFormOutput } from "../schemas/task.schema";

export type CreateTaskRequest = TaskFormOutput & {
  position: number;
};

export const taskService = {
  updateTask: async (
    id: string,
    task: Partial<TaskFormOutput>,
  ): Promise<Task> => {
    return api.put(`/task/${id}`, task);
  },
  updateStatus: async (updateStatus: UpdateStatusRequest): Promise<void> => {
    return api.patch(`/task/status`, updateStatus);
  },
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    return api.post("/task", task);
  },
  getTask: async (query?: QueryTaskRequest): Promise<PaginatedResult<Task>> => {
    return api.get("/task", {
      params: query,
    });
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
export interface QueryTaskRequest {
  title?: string;
  assigneeId?: string;
  priority?: string;
  dueFrom?: string;
  dueTo?: string;
  page?: number;
  limit?: number;
}
export class PaginationMeta {
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
export class PaginatedResult<T> {
  data!: T[];
  pagination!: PaginationMeta;
}
