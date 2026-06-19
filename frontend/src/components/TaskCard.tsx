import React, { memo, useCallback, useMemo } from "react";
import type { Task } from "../types/task.type";
import { DATE_LOCALE, DATE_TIME_ZONE } from "../constant/time.constant";
import { useBoardStore } from "../stores/board.store";
import { checkIsOverdue } from "../utils/date.util";
import { PRIORITY_MAP } from "../constant/priority.constant";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
interface TaskCardProps {
  task: Task;
  index: number;
}
const TaskCardComponent: React.FC<TaskCardProps> = ({ task, index }) => {
  const createdDate = useMemo(
    () =>
      new Date(task.createdAt).toLocaleString(DATE_LOCALE, {
        timeZone: DATE_TIME_ZONE,
      }),
    [task.createdAt],
  );
  const dueDate = useMemo(
    () =>
      new Date(task.dueDate).toLocaleString(DATE_LOCALE, {
        timeZone: DATE_TIME_ZONE,
      }),
    [task.dueDate],
  );
  const isOverDue = useMemo(
    () => checkIsOverdue(task.dueDate, task.status),
    [task.dueDate, task.status],
  );
  const priorityConfig = PRIORITY_MAP[task.priority];
  const openEditModal = useBoardStore((state) => state.openEditModal);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const openEdit = useCallback(
    () => openEditModal(task),
    [openEditModal, task],
  );
  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const isConfirmed = window.confirm(
        "Hệ thống Jira: Bạn có chắc chắn muốn xóa nhiệm vụ này không?",
      );
      if (isConfirmed) {
        await deleteTask(task.id);
      }
    },
    [deleteTask, task.id],
  );
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={openEdit}
          className={`bg-white p-4 rounded shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2 select-none ${isOverDue ? "ring-2 ring-red-500 bg-red-50/30" : ""} 
            ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500 opacity-70" : ""}`}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="group/delete inline-flex size-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition-colors hover:border-red-200 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={handleDelete}
              aria-label={`Xóa task ${task.title}`}
              title="Xóa task"
            >
              <Trash2
                className="size-4 transition-transform group-hover/delete:scale-110"
                aria-hidden="true"
              />
            </button>
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
      )}
    </Draggable>
  );
};

export const TaskCard = memo(TaskCardComponent);
TaskCard.displayName = "TaskCard";
