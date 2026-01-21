import { Navigate, Outlet } from "react-router-dom";
import { getToken, isTokenExpired, removeLocalVariables } from "../utility/auth.utility";

const ProtectedRoute = () => {
    const { hris_token, payroll_token } = getToken();



    if (!hris_token || isTokenExpired(hris_token) || !payroll_token || isTokenExpired(payroll_token)) {
        removeLocalVariables();
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />; // safe to render protected content
};

export default ProtectedRoute;
