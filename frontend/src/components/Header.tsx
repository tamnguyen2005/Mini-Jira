import { useBoardStore } from "../stores/board.store";

export const Header = () => {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  return (
    <header className="sticky top-0">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Mini Jira Dashboard
        </h1>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create task
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};
