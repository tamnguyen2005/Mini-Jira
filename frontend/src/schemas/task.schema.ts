import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 kí tự" }),
  description: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"], {
    message: "Vui lòng chọn độ ưu tiên",
  }),
  assignee: z.string().min(1, { message: "Vui lòng chọn người thực hiện" }),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.string().min(1, { message: "Vui lòng nhập ngày hạn chót" }),
});
// .transform((data) => {
//   return {
//     title: data.title,
//     description: data.description,
//     priority: data.priority,
//     assigneeId: data.assignee,
//     status: data.status,
//     dueDate: data.dueDate,
//   };
// });
export type TaskFormInput = z.input<typeof TaskSchema>;
export type TaskFormOutput = z.output<typeof TaskSchema>;
