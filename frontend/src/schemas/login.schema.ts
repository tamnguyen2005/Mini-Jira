import { z } from "zod";
export const LoginSchema = z.object({
  email: z
    .string({ message: "Email phải là chuỗi ký tự" })
    .min(1, { message: "Vui lòng nhập email" })
    .email({ message: "Email không đúng định dạng" }),
  password: z
    .string({ message: "Mật khẩu phải là chuỗi ký tự" })
    .min(6, { message: "Mật khẩu phải có tối thiểu 6 ký tự" })
    .max(12, { message: "Mật khẩu chỉ được tối đa 12 ký tự" }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;
