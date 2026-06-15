import { CheckCircle2, Kanban, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const benefits = [
  "Theo dõi công việc trên một bảng trực quan",
  "Sắp xếp ưu tiên và tiến độ rõ ràng",
  "Tập trung vào những việc quan trọng nhất",
];

export const AuthLayout = ({
  eyebrow,
  title,
  description,
  children,
}: AuthLayoutProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_30%)]" />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between p-12 lg:flex xl:p-16">
          <Link
            to="/"
            className="flex w-fit items-center gap-3 text-white"
            aria-label="Mini Jira"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/25">
              <Kanban className="size-6" />
            </span>
            <span className="text-xl font-bold tracking-tight">Mini Jira</span>
          </Link>

          <div className="max-w-xl">
            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200">
              <Sparkles className="size-4" />
              Quản lý công việc đơn giản hơn
            </div>
            <h2 className="text-5xl font-bold leading-[1.12] tracking-tight text-white xl:text-6xl">
              Biến kế hoạch thành
              <span className="block bg-linear-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                kết quả rõ ràng.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Không gian làm việc gọn gàng giúp bạn nắm bắt tiến độ và hoàn
              thành công việc đúng hạn.
            </p>

            <ul className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-slate-200"
                >
                  <CheckCircle2 className="size-5 text-indigo-300" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 Mini Jira. Làm việc thông minh, tiến bộ mỗi ngày.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-10 lg:rounded-l-[2.5rem] lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 flex w-fit items-center gap-3 text-slate-950 lg:hidden"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white">
                <Kanban className="size-5" />
              </span>
              <span className="text-lg font-bold">Mini Jira</span>
            </Link>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 leading-7 text-slate-500">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
};
