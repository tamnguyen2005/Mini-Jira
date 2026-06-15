import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string({ message: "Email phải là chuỗi ký tự" })
      .min(1, { message: "Vui lòng nhập email" })
      .email({ message: "Email không đúng định dạng" }),
    name: z
      .string({ message: "Tên phải là chuỗi ký tự" })
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    avatar_url: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || URL.canParse(value),
        "Đường dẫn ảnh không hợp lệ",
      ),
    password: z
      .string({ message: "Mật khẩu phải là chuỗi ký tự" })
      .min(6, { message: "Mật khẩu phải có tối thiểu 6 ký tự" })
      .max(12, { message: "Mật khẩu chỉ được tối đa 12 ký tự" }),
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
