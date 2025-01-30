import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && isAuthRoute) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
