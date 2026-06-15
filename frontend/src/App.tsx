import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/DashBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
