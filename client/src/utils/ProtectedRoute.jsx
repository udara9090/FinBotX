import { Navigate } from "react-router-dom";

// Utility to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children; // Render the child components (protected route)
};

export default ProtectedRoute;
