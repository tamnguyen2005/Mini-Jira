import { Home } from "./Home";
import { Header } from "../components/Header";
import { TaskFormModal } from "../components/TaskFormModal";
export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Home />
      <TaskFormModal />
    </div>
  );
};
