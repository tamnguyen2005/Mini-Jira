import { useAuthStore } from "../stores/auth.store";
import { useBoardStore } from "../stores/board.store";
import { Link } from "react-router-dom";

export const Header = () => {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const buttonClassName =
    "inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4 sm:text-sm";

  return (
    <header className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h1 className="shrink-0 text-xl font-bold text-slate-800 sm:text-2xl">
          Mini Jira Dashboard
        </h1>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {isAuthenticated ? (
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
              <img
                className="size-8 shrink-0 rounded-full object-cover ring-2 ring-slate-200"
                src={user?.avatar_url}
                alt="User Avatar"
              />
              <span className="min-w-0 truncate pb-0.5 text-sm leading-none text-slate-700">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className={buttonClassName}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={buttonClassName}
            >
              Login
            </Link>
          )}
          <button
            type="button"
            onClick={openCreateModal}
            className={`${buttonClassName} flex-1 whitespace-nowrap sm:flex-none`}
          >
            Create task
          </button>
        </div>
      </div>
    </header>
  );
};
