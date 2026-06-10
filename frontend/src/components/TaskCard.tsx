import React from "react";
import type { Task } from "../types/task.type";
import { DATE_LOCALE, DATE_TIME_ZONE } from "../constant/time.constant";
import { useBoardStore } from "../stores/board.store";
import { checkIsOverdue } from "../utils/date.util";
import { PRIORITY_MAP } from "../constant/priority.constant";
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
  const isOverDue = checkIsOverdue(task.dueDate, task.status);
  const priorityConfig = PRIORITY_MAP[task.priority];
  const openEditModal = useBoardStore((state) => state.openEditModal);
  return (
    <div
      onClick={() => openEditModal(task)}
      className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-end">
        <span
          className={`text-[10px] inline-block ${priorityConfig.badge} p-1`}
        >
          {task.priority}
        </span>
      </div>
      <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
      <p className="text-[12px] text-black mt-2 line-clamp-2">
        {task.description}
      </p>
      <span className="text-[12px] text-gray-400 block mt-2">
        Ngày tạo: {createdDate}
      </span>
      <span className="text-[12px] text-gray-400 block mt-2">
        Ngày tới hạn: {dueDate}
      </span>
      <span className="text-[10px] text-red-700 font-bold block mt-2">
        Assign to: {task.assignee.name}
      </span>
      {isOverDue && (
        <div className="flex justify-end">
          <span className={"text-red-600 font-bold animate-pulse"}>
            {isOverDue && " QUÁ HẠN!"}
          </span>
        </div>
      )}
    </div>
  );
};
