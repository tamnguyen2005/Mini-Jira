import { Home } from "./Home";
import { Header } from "../components/Header";
import { TaskFormModal } from "../components/TaskFormModal";
import { useCallback } from "react";
import { useKeyDown } from "../hooks/useKeyDown";
import { useBoardStore } from "../stores/board.store";

export const Dashboard = () => {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  const isModalOpen = useBoardStore((state) => state.isModalOpen);

  const openCreateTask = useCallback(() => {
    if (!isModalOpen) {
      openCreateModal();
    }
  }, [isModalOpen, openCreateModal]);

  useKeyDown(openCreateTask, { key: "n", altKey: true });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Home />
      <TaskFormModal />
    </div>
  );
};
