import { z } from "zod";
import { isPastDate } from "../utils/date.util";
export const BaseTaskSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 kí tự" }),
  description: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"], {
    message: "Vui lòng chọn độ ưu tiên",
  }),
  assigneeId: z.string().min(1, { message: "Vui lòng chọn người thực hiện" }),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.string().min(1, { message: "Vui lòng nhập ngày hạn chót" }),
});
export const CreateTaskSchema = BaseTaskSchema.refine(
  (data) => !isPastDate(data.dueDate),
  {
    path: ["dueDate"],
    message: "Ngày hạn chót không được ở trong quá khứ",
  },
);
export type TaskFormInput = z.infer<typeof BaseTaskSchema>;
export type TaskFormOutput = z.infer<typeof UpdateTaskSchema>;
