import type { Task } from "../types/task.type";
import { api } from "../api/api";
export const taskService = {
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    return api.patch(`/task/${id}`, task);
  },
};
