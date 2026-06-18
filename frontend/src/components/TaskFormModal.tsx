import { useForm, type UseFormReset } from "react-hook-form";
import type { TaskFormInput, TaskFormOutput } from "../schemas/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseTaskSchema, CreateTaskSchema } from "../schemas/task.schema";
import { useBoardStore } from "../stores/board.store";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Task } from "../types/task.type";
import { AuthService, type UserOption } from "../services/auth.service";
import { isPastDate } from "../utils/date.util";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const autoReset = (reset: UseFormReset<TaskFormInput>, t: Task | null) => {
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
    setFocus,
    formState: { isSubmitting, errors, dirtyFields, isDirty },
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(BaseTaskSchema),
    mode: "onTouched",
    defaultValues: { status: "BACKLOG", priority: "MEDIUM" },
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    autoReset(reset, taskToEdit);
  }, [isModalOpen, taskToEdit, reset]);

  const requestClose = useCallback(() => {
    if (
      isDirty &&
      !window.confirm("Bạn có thay đổi chưa lưu. Bạn vẫn muốn đóng form?")
    ) {
      return;
    }

    closeModal();
  }, [closeModal, isDirty]);

  useEffect(() => {
    if (!isModalOpen) return;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusTimer = window.setTimeout(() => setFocus("title"), 0);

    return () => {
      window.clearTimeout(focusTimer);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isModalOpen, setFocus]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, requestClose]);

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

  if (!isModalOpen) return null;
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
      try {
        await updateTask(taskToEdit.id, payload);
      } catch {
        return;
      }
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
      try {
        await addTask(createResult.data);
      } catch {
        return;
      }
    }
    closeModal();
  };
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        aria-describedby="task-form-description"
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150"
      >
        <h2
          id="task-form-title"
          className="text-lg font-bold text-gray-900 mb-1"
        >
          {taskToEdit ? "✏️ Cập nhật Nhiệm vụ" : "➕ Tạo Nhiệm vụ Mới"}
        </h2>
        <p id="task-form-description" className="mb-4 text-xs text-gray-500">
          Điền thông tin nhiệm vụ. Nhấn Esc để đóng hoặc Alt+N để mở form tạo
          mới.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Tiêu đề *
            </label>
            <input
              id="task-title"
              {...register("title")}
              disabled={isSubmitting}
              aria-invalid={errors.title ? "true" : "false"}
              className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Mô tả *
            </label>
            <input
              id="task-description"
              {...register("description")}
              disabled={isSubmitting}
              aria-invalid={errors.description ? "true" : "false"}
              className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="task-priority"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Độ ưu tiên
            </label>
            <select
              id="task-priority"
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
            <label
              htmlFor="task-status"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Trạng thái
            </label>
            <select
              id="task-status"
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
            <label
              htmlFor="task-assignee"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Người được giao
            </label>
            <select
              id="task-assignee"
              disabled={isSubmitting || isLoadingUsers}
              {...register("assigneeId")}
              aria-invalid={errors.assigneeId ? "true" : "false"}
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
            <label
              htmlFor="task-due-date"
              className="block text-xs font-bold uppercase text-gray-500 mb-1"
            >
              Hạn chót *
            </label>
            <input
              id="task-due-date"
              disabled={isSubmitting}
              type="date"
              {...register("dueDate")}
              aria-invalid={errors.dueDate ? "true" : "false"}
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
              onClick={requestClose}
              aria-label="Đóng form nhiệm vụ"
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
