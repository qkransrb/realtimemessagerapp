import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";

interface Props {
  requiredAuth?: boolean;
}

const RouteGuard = ({ requiredAuth }: Props) => {
  const { user } = useAuth();

  if (requiredAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (!requiredAuth && user) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
