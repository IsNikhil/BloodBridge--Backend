import { Navigate } from "react-router-dom";
import { useAuth } from "../authentication/use-auth";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loader

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "Admin") return <Navigate to="/" replace />;

  return children;
};
