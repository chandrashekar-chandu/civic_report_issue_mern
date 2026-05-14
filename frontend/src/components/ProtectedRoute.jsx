import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait until authentication status is checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check authorization
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;