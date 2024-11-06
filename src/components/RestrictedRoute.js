import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const RestrictedRoute = ({ component: Component, redirectTo = '/' }) => {
  const { isLoggedIn } = useAuth();
  const previousLocation = localStorage.getItem('previousLocation') || redirectTo;

  if (isLoggedIn) {
    return <Navigate to={previousLocation} replace />;
  }

  return Component; 
};