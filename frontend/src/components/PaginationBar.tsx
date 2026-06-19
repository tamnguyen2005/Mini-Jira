import { useSearchParams } from "react-router-dom";
import { useBoardStore } from "../stores/board.store";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationBar = () => {
  const page = useBoardStore((state) => state.page);
  const totalPages = useBoardStore((state) => state.totalPages);
  const [searchParams, setSearchParams] = useSearchParams();
  const toPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const param = new URLSearchParams(searchParams);
    param.set("page", String(newPage));
    setSearchParams(param);
  };

  if (totalPages <= 1) return null;

  const navigationButtonClass =
    "inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600";

  return (
    <nav
      aria-label="Phân trang"
      className="my-6 flex items-center justify-center"
    >
      <div className="flex max-w-full items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={page === 1}
          onClick={() => toPage(page - 1)}
          className={navigationButtonClass}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <div className="flex max-w-[55vw] items-center gap-1 overflow-x-auto px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = page === pageNumber;

            return (
              <button
                type="button"
                key={pageNumber}
                aria-label={`Đến trang ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => toPage(pageNumber)}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Trang sau"
          disabled={page === totalPages}
          onClick={() => toPage(page + 1)}
          className={navigationButtonClass}
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
