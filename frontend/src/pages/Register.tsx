import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Image,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../components/AuthLayout";
import {
  RegisterSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Không thể tạo tài khoản. Vui lòng thử lại.";
};

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
    defaultValues: { avatar_url: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError("");
      await AuthService.register({
        email: data.email,
        name: data.name,
        password: data.password,
        avatar_url: data.avatar_url,
      });
      navigate("/login?registered=true", { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  const inputClassName =
    "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  return (
    <AuthLayout
      eyebrow="Bắt đầu ngay hôm nay"
      title="Tạo tài khoản mới"
      description="Thiết lập không gian làm việc của bạn chỉ trong vài bước."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Họ và tên
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              className={inputClassName}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-rose-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Địa chỉ email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              className={inputClassName}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-rose-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="avatar"
              className="text-sm font-semibold text-slate-700"
            >
              Ảnh đại diện
            </label>
            <span className="text-xs text-slate-400">Không bắt buộc</span>
          </div>
          <div className="relative">
            <Image className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="avatar"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              className={inputClassName}
              {...register("avatar_url")}
            />
          </div>
          {errors.avatar_url && (
            <p className="mt-1.5 text-sm text-rose-600">
              {errors.avatar_url.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                className={`${inputClassName} pr-11`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-rose-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className={inputClassName}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-rose-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          {!isSubmitting && (
            <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-bold text-indigo-600 hover:text-indigo-500"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
};
