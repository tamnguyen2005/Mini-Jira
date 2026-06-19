import { useForm } from "react-hook-form";
import { useAuthStore } from "../stores/auth.store";
import { LoginSchema, type LoginFormData } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "../components/AuthLayout";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import { ROUTES } from "../constant/app.constants";

interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  avatar_url: string;
}

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
  return "Không thể đăng nhập. Vui lòng thử lại.";
};

const decodeToken = (token: string): TokenPayload => {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Token không hợp lệ");
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(
    decodeURIComponent(escape(atob(normalized))),
  ) as TokenPayload;
};

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const registered = searchParams.has("registered");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitError("");
      const response = await AuthService.login(data);
      const user = decodeToken(response.accessToken);
      login(user, response.accessToken);
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      eyebrow="Chào mừng trở lại"
      title="Đăng nhập tài khoản"
      description="Tiếp tục quản lý công việc và theo dõi tiến độ của bạn."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {registered && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Địa chỉ email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </label>
            <button
              type="button"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
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
            <p className="mt-2 text-sm text-rose-600">
              {errors.password.message}
            </p>
          )}
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
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          {!isSubmitting && (
            <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link
          to={ROUTES.register}
          className="font-bold text-indigo-600 hover:text-indigo-500"
        >
          Đăng ký miễn phí
        </Link>
      </p>
    </AuthLayout>
  );
};
