import React from "react";
import type { Task } from "../types/task.type";
import { DATE_LOCALE, DATE_TIME_ZONE } from "../constant/config";
interface TaskCardProps {
  task: Task;
}
export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const createdDate = new Date(task.createdAt).toLocaleString(DATE_LOCALE, {
    timeZone: DATE_TIME_ZONE,
  });
  const dueDate = new Date(task.dueDate).toLocaleString(DATE_LOCALE, {
    timeZone: DATE_TIME_ZONE,
  });
  return (
    <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
      <span className="text-[10px] text-gray-400 block mt-2">
        Created date: {createdDate}
      </span>
      <span className="text-[10px] text-gray-400 block mt-2">
        Due date: {dueDate}
      </span>
      <span className="text-[10px] text-red-700 font-bold block mt-2">
        Assign to: {task.assignee.name}
      </span>
    </div>
  );
};
