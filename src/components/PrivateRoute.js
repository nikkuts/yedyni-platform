import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";

export const PrivateRoute = ({redirectTo}) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    
    if (!isLoggedIn) {
      localStorage.setItem('previousLocation', location.pathname); 
    }

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

