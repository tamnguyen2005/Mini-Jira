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
export const isPastDate = (value: string) => {
  const selectedDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
};
