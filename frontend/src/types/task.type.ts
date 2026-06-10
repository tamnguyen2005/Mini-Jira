export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export interface TaskAssignee {
  id: string;
  name: string;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: TaskAssignee;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}
