import React from "react";
import type { Task, TaskStatus } from "../types/task.type";
import { TaskCard } from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  status,
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

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-3 p-1 rounded-lg transition-colors duration-200 min-h-37.5
              ${snapshot.isDraggingOver ? "bg-blue-50/60 border-2 border-dashed border-blue-200" : ""}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Chưa có nhiệm vụ nào</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task.id} index={index} task={task} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
