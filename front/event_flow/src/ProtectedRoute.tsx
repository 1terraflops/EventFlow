import React, { JSX } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/UserStore";
import LoginPage from "./components/pages/LoginPage";

interface ProtectedRouteProps {
  userRole: string;
  requiredRole?: string;
  allowAllRegistered?: boolean;
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  userRole,
  requiredRole,
  allowAllRegistered,
  children,
}) => {
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/login");
    return <LoginPage></LoginPage>;
  }

  if (allowAllRegistered) {
    return children;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
