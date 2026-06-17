import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import type { TaskPriority } from "../types/task.type";
import { AuthService, type UserOption } from "../services/auth.service";

export const FilterToolBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") || "");
  const debounceSearch = useDebounce(searchTerm);
  const [users, setUsers] = useState<UserOption[]>([]);
  const currentPriorities =
    searchParams.get("priority")?.split(",").filter(Boolean) || [];
  useEffect(() => {
    const param = new URLSearchParams(searchParams);
    if (debounceSearch) {
      param.set("title", debounceSearch);
    } else {
      param.delete("title");
    }
    if (param.toString() === searchParams.toString()) return;
    setSearchParams(param);
  }, [debounceSearch, searchParams, setSearchParams]);
  useEffect(() => {
    const fetchUser = async () => {
      setUsers(await AuthService.getUsers());
    };
    void fetchUser();
  }, []);
  const handlePriorityToggle = (priority: TaskPriority) => {
    const param = new URLSearchParams(searchParams);
    let updatedPriorities = [...currentPriorities];
    if (updatedPriorities.includes(priority)) {
      updatedPriorities = updatedPriorities.filter((p) => p !== priority);
    } else {
      updatedPriorities.push(priority);
    }
    if (updatedPriorities.length > 0) {
      param.set("priority", updatedPriorities.join(","));
    } else {
      param.delete("priority");
    }
    setSearchParams(param);
  };
  const handleClearAll = () => {
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tiêu đề nhiệm vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase">
            Độ ưu tiên:
          </span>
          {priorities.map((p) => {
            const isSelected = currentPriorities.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePriorityToggle(p)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }
                `}
              >
                {p}
              </button>
            );
          })}
        </div>
        <select
          value={searchParams.get("assigneeId") || ""}
          onChange={(e) => {
            const param = new URLSearchParams(searchParams);
            if (e.target.value) {
              param.set("assigneeId", e.target.value);
            } else {
              param.delete("assigneeId");
            }
            setSearchParams(param);
          }}
          className="border p-2 rounded text-sm"
        >
          <option value="">Tất cả người thực hiện</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={searchParams.get("dueFrom") || ""}
          max={searchParams.get("dueTo") || undefined}
          className="border p-2 rounded text-sm"
          onChange={(e) => {
            const param = new URLSearchParams(searchParams);
            if (e.target.value) {
              param.set("dueFrom", e.target.value);
            } else {
              param.delete("dueFrom");
            }
            setSearchParams(param);
          }}
        />
        <input
          type="date"
          value={searchParams.get("dueTo") || ""}
          min={searchParams.get("dueFrom") || undefined}
          className="border p-2 rounded text-sm"
          onChange={(e) => {
            const param = new URLSearchParams(searchParams);
            if (e.target.value) {
              param.set("dueTo", e.target.value);
            } else {
              param.delete("dueTo");
            }
            setSearchParams(param);
          }}
        />
      </div>
      {searchParams.toString() && (
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded bg-red-50/50 transition-colors"
        >
          🧹 Xóa bộ lọc
        </button>
      )}
    </div>
  );
};
