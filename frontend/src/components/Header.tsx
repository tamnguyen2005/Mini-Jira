import { useAuthStore } from "../stores/auth.store";
import { useBoardStore } from "../stores/board.store";
import { Link } from "react-router-dom";

export const Header = () => {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  return (
    <header className="sticky top-0">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Mini Jira Dashboard
        </h1>
        <div className="flex gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <img
                className="size-7 rounded-full object-cover ring-2 ring-slate-200"
                src={user?.avatar_url}
                alt="User Avatar"
              />
              <span className="pb-0.5 leading-none text-slate-700">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Login
            </Link>
          )}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create task
          </button>
        </div>
      </div>
    </header>
  );
};
