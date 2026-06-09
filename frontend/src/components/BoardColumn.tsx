import React from "react";
import type { Task, TaskStatus } from "../types/task.type";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  tasks,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col min-h-125 w-full shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">
          {title}
        </h3>
        <span className="bg-gray-300 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Chưa có nhiệm vụ nào</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};
