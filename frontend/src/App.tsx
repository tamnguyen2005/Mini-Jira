import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallBack";
import { Toaster } from "react-hot-toast";
import { ROUTES } from "./constant/app.constants";

const Dashboard = lazy(() =>
  import("./pages/DashBoard").then((module) => ({ default: module.Dashboard })),
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register })),
);
function App() {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense
          fallback={
            <div className="min-h-screen grid place-items-center text-sm text-slate-600">
              Đang tải giao diện...
            </div>
          }
        >
          <Routes>
            <Route path={ROUTES.home} element={<Dashboard />} />
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.register} element={<Register />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </Suspense>
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
