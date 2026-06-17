import { useForm } from "react-hook-form";
import type { TaskFormInput, TaskFormOutput } from "../schemas/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseTaskSchema, CreateTaskSchema } from "../schemas/task.schema";
import { useBoardStore } from "../stores/board.store";
import { useEffect, useState } from "react";
import type { Task } from "../types/task.type";
import { AuthService, type UserOption } from "../services/auth.service";
import { isPastDate } from "../utils/date.util";
const autoReset = (reset: (task: Task) => void, t: Task | null) => {
  if (t) {
    reset({
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assigneeId: t.assignee.id,
      dueDate: t.dueDate.split("T")[0],
    });
  } else {
    reset({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "BACKLOG",
      assigneeId: "",
      dueDate: "",
    });
  }
};
const getDirtyTaskPayload = (
  data: TaskFormOutput,
  dirtyFields: Partial<Record<keyof TaskFormInput, boolean>>,
): Partial<TaskFormOutput> => {
  const payload: Partial<TaskFormOutput> = {};
  if (dirtyFields.title) payload.title = data.title;
  if (dirtyFields.description) payload.description = data.description;
  if (dirtyFields.priority) payload.priority = data.priority;
  if (dirtyFields.status) payload.status = data.status;
  if (dirtyFields.assigneeId) payload.assigneeId = data.assigneeId;
  if (dirtyFields.dueDate) payload.dueDate = data.dueDate;
  return payload;
};
export const TaskFormModal = () => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");
  const { addTask, updateTask, closeModal, isModalOpen, taskToEdit } =
    useBoardStore();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(BaseTaskSchema),
    mode: "onTouched",
    defaultValues: { status: "BACKLOG", priority: "MEDIUM" },
  });
  useEffect(() => {
    autoReset(reset, taskToEdit);
  }, [isModalOpen, taskToEdit, reset, closeModal]);

  useEffect(() => {
    if (!isModalOpen || users.length > 0) return;

    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setUserError("");
        setUsers(await AuthService.getUsers());
      } catch {
        setUserError("Không thể tải danh sách người dùng");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void fetchUsers();
  }, [isModalOpen, users.length]);

  if (!isModalOpen) return;
  const onSubmit = async (data: TaskFormOutput) => {
    if (taskToEdit) {
      if (dirtyFields.dueDate && isPastDate(data.dueDate)) {
        setError("dueDate", {
          type: "manual",
          message: "Ngày hạn chót không được ở trong quá khứ",
        });
        return;
      }
      const payload = getDirtyTaskPayload(data, dirtyFields);

      if (Object.keys(payload).length === 0) {
        closeModal();
        return;
      }
      await updateTask(taskToEdit.id, payload);
    } else {
      const createResult = CreateTaskSchema.safeParse(data);
      if (!createResult.success) {
        setError("dueDate", {
          type: "manual",
          message:
            createResult.error.flatten().fieldErrors.dueDate?.[0] ??
            "Ngày hạn chót không hợp lệ",
        });
        return;
      }
      await addTask(createResult.data);
    }
    closeModal();
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {taskToEdit ? "✏️ Cập nhật Nhiệm vụ" : "➕ Tạo Nhiệm vụ Mới"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Tiêu đề *
            </label>
            <input
              {...register("title")}
              disabled={isSubmitting}
              className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Mô tả *
            </label>
            <input
              {...register("description")}
              disabled={isSubmitting}
              className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Độ ưu tiên
            </label>
            <select
              disabled={isSubmitting}
              {...register("priority")}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="LOW">🟢 Thấp (LOW)</option>
              <option value="MEDIUM">🟡 Trung bình (MEDIUM)</option>
              <option value="HIGH">🔴 Cao (HIGH)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Trạng thái
            </label>
            <select
              disabled={isSubmitting}
              {...register("status")}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="BACKLOG">BACKLOG</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Người được giao
            </label>
            <select
              disabled={isSubmitting || isLoadingUsers}
              {...register("assigneeId")}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">
                {isLoadingUsers
                  ? "Đang tải người dùng..."
                  : "Chọn người thực hiện"}
              </option>
              {taskToEdit && (
                <option value={taskToEdit.assignee.id}>
                  {taskToEdit.assignee.name}
                </option>
              )}
              {users
                .filter((user) => user.id !== taskToEdit?.assignee.id)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>
            {errors.assigneeId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.assigneeId.message}
              </p>
            )}
            {userError && (
              <p className="text-red-500 text-xs mt-1">{userError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Hạn chót *
            </label>
            <input
              disabled={isSubmitting}
              type="date"
              {...register("dueDate")}
              className="w-full border p-2 rounded text-sm"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border text-gray-600 rounded text-sm hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {taskToEdit ? "Lưu thay đổi" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
