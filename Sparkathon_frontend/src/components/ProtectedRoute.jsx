import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Clear any orphaned user data if token is missing
    localStorage.removeItem("user");
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
