import type { TaskStatus } from "../types/task.type";

export const checkIsOverdue = (
  dueDate: string,
  status: TaskStatus,
): boolean => {
  if (status === "DONE") return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due.getTime() < now.getTime();
};
