import type { ReactNode } from "react";
import { useAuthStore } from "../stores/auth.store";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constant/app.constants";

interface RouteGuardProps {
  children: ReactNode;
}
export const RouteGuard = ({ children }: RouteGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return children;
  return <Navigate to={ROUTES.login} replace={true} />;
};
