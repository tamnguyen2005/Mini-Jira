import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { TaskFormModal } from "./components/TaskFormModal";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Home />
      <TaskFormModal/>
    </div>
  );
}

export default App;
