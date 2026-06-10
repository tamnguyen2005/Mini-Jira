import { z } from "zod";
export const TaskSchema = z
  .object({
    title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 kí tự" }),
    description: z.string().optional(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"], {
      message: "Vui lòng chọn độ ưu tiên",
    }),
    assignee: z.string().min(1, { message: "Vui lòng chọn người thực hiện" }),
    status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
    dueDate: z.string().min(1, { message: "Vui lòng nhập ngày hạn chót" }),
  })
  .transform((data) => {
    const mockUser = [
      { id: "user_1", name: "Nguyễn Minh Tâm" },
      { id: "user_2", name: "Nguyễn Thị Bích Trâm" },
      { id: "user_3", name: "Huỳnh Đăng Khoa" },
      { id: "user_4", name: "Phạm Ngọc Khôi Nguyên" },
      { id: "user_5", name: "Phạm Thị Hồng" },
    ];
    const selected = mockUser.find((u) => u.id === data.assignee);
    return {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: selected,
      status: data.status,
      dueDate: data.dueDate,
    };
  });
export type TaskFormInput = z.input<typeof TaskSchema>;
export type TaskFormOutput = z.output<typeof TaskSchema>;
