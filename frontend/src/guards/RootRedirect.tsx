import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "../constant/app.constants";

export const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to={ROUTES.home} replace={true} />;
  return <Navigate to={ROUTES.login} replace={true} />;
};
