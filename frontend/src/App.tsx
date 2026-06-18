import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/DashBoard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallBack";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: { background: "#333", color: "#fff", fontSize: "13px" },
        }}
      />
    </>
  );
}

export default App;
